import { createClient } from 'redis';

const createNoOpCache = () => ({
  get: async () => null,
  set: async () => {},
  del: async () => {},
  getOrSet: async (_, __, fetchFn) => fetchFn(),
});

export const createRedisClient = async () => {
  const url = process.env.REDIS_URL;

  if (!url) {
    console.info('REDIS_URL not set; Redis caching disabled.');
    return createNoOpCache();
  }

  const client = createClient({ url });

  client.on('error', (err) => console.error('Redis error:', err));

  try {
    await client.connect();
  } catch (err) {
    console.error('Redis connection failed, cache disabled:', err.message);
    return createNoOpCache();
  }

  console.info('Redis cache connected.');

  const cache = {
    get: async (key) => {
      const value = await client.get(key);

      if (!value) {
        return null;
      }

      try {
        return JSON.parse(value);
      } catch (err) {
        console.error(`Invalid cache payload for key "${key}", clearing entry:`, err.message);
        await client.del(key);
        return null;
      }
    },
    set: async (key, value, ttlSeconds = 300) => {
      await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
    },
    del: async (keys) => {
      const normalizedKeys = Array.isArray(keys) ? keys : [keys];
      const cacheKeys = normalizedKeys.filter(Boolean);

      if (cacheKeys.length === 0) {
        return;
      }

      await client.del(cacheKeys);
    },
    getOrSet: async (key, ttlSeconds, fetchFn) => {
      const cached = await cache.get(key);
      if (cached !== null) return cached;
      const fresh = await fetchFn();
      await cache.set(key, fresh, ttlSeconds);
      return fresh;
    },
  };

  return cache;
};
