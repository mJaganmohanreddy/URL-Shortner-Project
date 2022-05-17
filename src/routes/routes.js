const express = require('express')
const router = express.Router();


const urlcontroller = require('../controller/urlcontroller')


router.post('/url/shorten', urlcontroller.createUrl);





module.exports = router;
