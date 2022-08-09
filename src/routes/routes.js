const express = require('express')
const router = express.Router();


const urlcontroller = require('../controller/urlcontroller')


router.post('/url/shorten', urlcontroller.createUrl);

router.get('/:urlCode', urlcontroller.getData)




module.exports = router;
