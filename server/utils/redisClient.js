const { createClient } = require('redis');
const { promisify } = require('util');

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || '',
  socket: {
    connectTimeout: 10000
  }
});

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Redis connection error:', error);
  }
})();

// Cache middleware
const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        // Return cached data
        return res.json(JSON.parse(cachedData));
      }

      // Store the original send function
      const originalSend = res.send;

      // Override the send function to cache the response before sending
      res.send = function(body) {
        try {
          // Only cache valid JSON responses
          if (res.statusCode === 200) {
            // Store in cache
            redisClient.set(key, body, { EX: duration }).catch(err => console.error('Redis set error:', err));
          }
        } catch (error) {
          console.error('Caching error:', error);
        }

        // Call the original send function
        originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Function to invalidate cache for specific paths
const invalidateCache = async (pattern) => {
  try {
    if (!pattern) return;
    
    // Use SCAN to find keys matching the pattern
    let cursor = 0;
    do {
      const scanResult = await redisClient.scan(cursor, { MATCH: `cache:${pattern}*`, COUNT: 100 });
      cursor = scanResult.cursor;
      
      // Delete all found keys
      if (scanResult.keys.length > 0) {
        await redisClient.del(scanResult.keys);
        console.log(`Invalidated ${scanResult.keys.length} cache entries matching: ${pattern}*`);
      }
    } while (cursor !== 0);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

module.exports = {
  redisClient,
  cacheMiddleware,
  invalidateCache
}; 