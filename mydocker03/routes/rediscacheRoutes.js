const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');




// Start try to connect Redis.
const redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });
  
(async () => {
    await redisClient.connect();
})();


redisClient.on('connect', () => {
    console.log('Connected to Redis...');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});





//  To test .. just execute  'http://localhost:3000/api/rediscacheaddress/864'
router.get('/search/:key', async (req, res) => {
  const key = req.params.key;

  try {
      console.log(`${key}`)
      const value = await redisClient.get(`addressid:${key}`); // Get value from Redis
      if (value) {
          const data = JSON.parse(value); // Convert back to JSON object
          res.json(data); // Respond with JSON
      } else {
          res.status(404).send('Data not found.');
      }
  } catch (err) {
      console.error('Error retrieving data from Redis:', err);
      res.status(500).send('Error retrieving data.');
  }
});

module.exports = router;