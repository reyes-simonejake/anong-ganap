import { createClient } from 'redis';

export const createRedisClient = () => {
  const url = process.env.REDIS_URL;

  if (!url) {
    console.log('⚠️  REDIS_URL not set — Redis caching disabled (running without cache)');
    return {
      get: async () => null,
      set: async () => {},
      del: async () => {},
      // Provide a no-op getOrSet that immediately calls the fallback
      getOrSet: async (_, ttl, fetchFn) => fetchFn(),
    };
  }

  const client = createClient({ url });

  client.on('error', (err) => console.error('Redis error:', err));

  await client.connect();

  console.log('✅ Redis connected');

  return {
    get: async (key) => {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    },
    set: async (key, value, ttlSeconds = 300) => {
      await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
    },
    del: async (key) => {
      await client.del(key);
    },
    getOrSet: async (key, ttlSeconds, fetchFn) => {
      const cached = await get(key);
      if (cached) return cached;
      const fresh = await fetchFn();
      await set(key, fresh, ttlSeconds);
      return fresh;
    },
  };
};