const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('Hey! It works!');
});

router.get('/reverse/:name', (req, res) => {
  console.log(res);
})

module.exports = router;
