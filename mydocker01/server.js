const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (req, res) => {
    res.send('GET request to the homepage');
});

app.post('/api', (req, res) => {
    res.send('POST request to the homepage');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});