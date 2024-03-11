const express = require('express');
const {randomUUID} = require('crypto');
const CryptoJS = require('crypto-js');
const router = express.Router();
const connection = require('../lib/conn');



//get all results


//get specific result


//save results
router.post('/add', (req, res) => {
    const gameResult = req.body;
    const UUID = randomUUID();

})



































module.exports = router;