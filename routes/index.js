const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('Hey! It works!');
});

<<<<<<< HEAD
=======
router.get('/reverse', (req, res) => {
  res.send('Hey! Reverse works!');
})
>>>>>>> d33fe28e240a8dcb326e9b2de27e124495aced84

module.exports = router;
