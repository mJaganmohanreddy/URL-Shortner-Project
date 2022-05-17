const express = require('express')
const router = express.Router();


const urlcontroller = require('../controllers/urlcontroller')


router.post('/url/shorten', urlcontroller.createUrl);





module.exports = router;
