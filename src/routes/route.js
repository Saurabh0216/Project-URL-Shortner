const express = require('express');
const router = express.Router();
const urlController = require('../controller/urlController');

//url shorting
router.post('/url/shorten', urlController.createUrl); //POST /url/shorten
router.get('/:urlCode',urlController.getCode) //GET /:urlCode

router.post("*",(req,res)=>{
    return res.status(404).send({message:"Page Not Found"})
})

router.get("*",(req,res)=>
{
    return res.status(404).send({message:"Page Not Found"})
})


module.exports = router;