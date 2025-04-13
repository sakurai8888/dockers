// utils/redisLoader.js

const path = require('path');
const fs = require('fs');
const redis = require('redis');



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



const loadAddressesToRedis = () => {
    const jsonFilePath = path.join(__dirname, '../data/randomaddress.json');

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading randomaddress.json:', err);
            return;
        }
        const addresses = JSON.parse(data);
        // addresses.forEach(address => {
        //     redisClient.set(address.id, JSON.stringify(address), (err) => {
        //         if (err) {
        //             console.error('Error storing address in Redis:', err);
        //         } else {
        //             console.log(`Stored address with ID ${address.id} in Redis.`);
        //         }
        //     });
        // });
        addresses.forEach(address => {
            redisClient.set(`addressid:${address.building}`, JSON.stringify(address), (err) => {
                if (err) {
                    console.error('Error storing address in Redis:', err);
                } else {
                    console.log(`Stored address with ID ${address.id} in Redis.`);
                }
            });
        });

        /*
        addresses.forEach( thisaddress =>{
            const mybuilding = thisaddress.building;
            console.log(`This is: ${mybuilding}`);

        });

        */

    });
};

module.exports = loadAddressesToRedis; // Export the function