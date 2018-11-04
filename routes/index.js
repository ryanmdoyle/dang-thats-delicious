const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storecontroller')

// Do work here
// res.send();
// res.json();
// res.render();

router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);


module.exports = router;
