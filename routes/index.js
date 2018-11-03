const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('Hey! It works!');
});

router.get('/reverse/:name', (req, res) => {
  const reversed = [...req.params.name].reverse().join('');
  res.send(reversed);
});

module.exports = router;
