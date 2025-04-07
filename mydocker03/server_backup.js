const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const mongourl = 'mongodb://admin:Aa12345678@mongodb:27017/mydb01?authSource=admin';

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

// Serve static files
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});