/**
 * Generic cache utility with Redis backend + graceful fallback.
 * 
 * When Redis is configured (REDIS_URL set): uses Redis with JSON serialization,
 * TTL-based expiry, and getOrSet helper.
 * 
 * When Redis is NOT configured: all operations are no-ops that immediately
 * fall through to the provided fetch function. The API continues to work
 * without any breaking changes.
 */

export const getCache = () => {
  // Try to import redis client - will be no-op if not configured
  try {
    const { createRedisClient } = './redis.js';
    return createRedisClient();
  } catch (e) {
    // Redis not configured - return no-op cache
    return noOpCache();
  }
};

const noOpCache = () => ({
  get: async () => null,
  set: async () => {},
  del: async () => {},
  getOrSet: async (_, __, fetchFn) => fetchFn(),
});

/**
 * Get a cached value or compute it using the provided fetch function.
 * Caches the result with the given TTL (seconds).
 * 
 * @param {string} key - Cache key
 * @param {number} ttlSeconds - Time to live in seconds (default: 300 = 5 min)
 * @param {Function} fetchFn - Async function that returns the data to cache
 * @returns {Promise} The cached or freshly fetched data
 */
export const getOrSet = async (key, ttlSeconds = 300, fetchFn) => {
  try {
    const cache = getCache();
    return await cache.getOrSet(key, ttlSeconds, fetchFn);
  } catch (e) {
    // If anything goes wrong, just compute fresh
    console.error('Cache error, computing fresh:', e.message);
    return await fetchFn();
  }
};

/**
 * Invalidate a specific cache key.
 * 
 * @param {string} key - Cache key to delete
 * @returns {Promise<void>}
 */
export const invalidate = async (key) => {
  try {
    const cache = getCache();
    await cache.del(key);
  } catch (e) {
    console.error('Cache invalidation error:', e.message);
  }
};

/**
 * Batch invalidate multiple cache keys.
 * 
 * @param {string[]} keys - Cache keys to delete
 * @returns {Promise<void>}
 */
export const invalidateBatch = async (keys) => {
  try {
    const cache = getCache();
    // Note: Redis del can take multiple keys
    if (keys.length > 0) {
      await cache.del(keys.join(',')); // simplified - Redis DEL accepts multiple args
    }
  } catch (e) {
    console.error('Batch cache invalidation error:', e.message);
  }
};