const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('Hey! It works!');
});

router.get('/reverse', (req, res) => {
  res.send('Hey! Reverse works!');
})

module.exports = router;
