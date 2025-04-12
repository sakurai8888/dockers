const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes'); // Import user routes   
const sessionRoutes = require('./routes/sessionRoutes'); // Import user routes   
const app = express();
const PORT = process.env.PORT || 3000;
const mongourl = 'mongodb://admin:Aa12345678@mongodb:27017/mydb01?authSource=admin';
require('dotenv').config();    // Load .env data.






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




// End try to connect Redis.





/*
Load to Redis Start
*/

const loadAddressesToRedis = () => {
    const jsonFilePath = path.join(__dirname, './data/randomaddress.json');

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

loadAddressesToRedis();



/*
Load to Redis End
*/


console.log(`Log ${process.env.REDIS_HOST}`);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const addressSchema = new mongoose.Schema({
    building: String,
    floor: Number,
    flat: Number,
    street_number: String,
    street_name: String,
    city: String,
    country: String,
    full_address: String
});

const Address = mongoose.model('mymongoaddresses', addressSchema, 'mymongoaddresses');

// API to search addresses
app.get('/api/addresses', async (req, res) => {
    const { query } = req.query;
    if (query.length < 3) {
        return res.status(400).json({ message: "Query must be at least 3 characters long." });
    }
    console.log(`Searching for addresses with query: "${query}"`);
    const addresses = await Address.find({ full_address: { $regex: query, $options: 'i' } }).limit(30);
    console.log(`Found addresses: ${JSON.stringify(addresses)}`);
    res.json(addresses);
});


//  To test .. just execute  'http://localhost:3000/api/rediscacheaddress/864'
app.get('/api/rediscacheaddress/:key', async (req, res) => {
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


// Use any custom routes 

// Use userRoutes. 

app.use('/myusers', userRoutes);

app.use('/sessions', sessionRoutes);

// Serve static files
app.use(express.static('public'));




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});