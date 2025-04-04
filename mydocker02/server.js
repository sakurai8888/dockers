const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON bodiesasdfasdf

// POST API endpoint
app.post('/api/postdata', (req, res) => {
    console.log('Received POST data:', req.body.testing); // Log the received body
    res.json({ message: 'Data received successfully New New New New !', data: req.body.testing }); // Send response
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});