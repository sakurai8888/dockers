const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');


// Init Parameters
require('dotenv').config();    // Load .env data.
const PORT = process.env.PORT || 3000;
const mongourl = 'mongodb://admin:Aa12345678@mongodb:27017/mydb01?authSource=admin';




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


router.get('/search', async (req, res) => {
  const { query } = req.query;
    if (query.length < 3) {
        return res.status(400).json({ message: "Query must be at least 3 characters long." });
    }
    console.log(`Searching for addresses with query: "${query}"`);
    const addresses = await Address.find({ full_address: { $regex: query, $options: 'i' } }).limit(30);
    console.log(`Found addresses: ${JSON.stringify(addresses)}`);
    res.json(addresses);
});


module.exports = router;