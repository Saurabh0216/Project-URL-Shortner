const express = require('express');
const router = express.Router();
const urlController = require('../controller/urlController');

//url shorting
router.post('/url/shorten', urlController.createUrl); //POST /url/shorten
router.get('/:urlCode',urlController.getCode) //GET /:urlCode

module.exports = router;