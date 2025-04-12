const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  console.log('Get sessions successful'); // Debugging log
  res.status(201).json('Get sessions successful');
});

module.exports = router;