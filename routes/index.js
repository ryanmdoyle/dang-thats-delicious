const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')

const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
// res.send();
// res.json();
// res.render();

router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));


module.exports = router;
