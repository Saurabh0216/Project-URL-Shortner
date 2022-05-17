const shortid = require('shortid')
const urlModel= require("../model/urlModel")
//const isValid = require("../validator/validator")

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}

    const createUrl = async(req,res)=> 
 {
    try {
        
        const longUrl = req.body.longUrl
        const baseUrl = "http://localhost:3000"
        
        if(!isValid(longUrl))
        {
            return res.status(400).send({status:false,message:"Please Provide Url"})
        }

        if(!(/http(s?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(longUrl)))
        {
            return res.status(400).send({status:false,message:"Please Provide valid Url"})
        }
        const isUrlPresent = await urlModel.findOne({longUrl:longUrl})

        if(isUrlPresent){
            return res.status(200).send({status:true, message:"Short URL already created for this provide Long URL", data:isUrlPresent})
        }


        const urlCode = shortid.generate()   // generate shortid for a request
        const shortUrl = baseUrl+ '/' + urlCode

        const urlCreate = await urlModel.create({urlCode,longUrl,shortUrl})
        {
            return res.status(201).send({status:true, message:"Short Url created successfully!",data:urlCreate})
        }


    } catch (error) {
        return res.status(500).send({status:false, message: error.message})
        
    }
 };

 //..................................Get url..................................//

 const getCode = async (req, res)=>
 {
     try {

        let urlCode=req.params.urlCode

        isUrlCodePresent = await urlModel.findOne({urlCode:urlCode})

        // if(urlCode.trim().length==0){
        //     return res.status(400).send({status:false, message:"Please provide urlcode"})
        // }

        if(!isUrlCodePresent){
            return res.status(404).send({status:false, message:"Url not found"})
        }
        const data = await urlModel.findOne({ urlCode: urlCode }).select({longUrl:1, _id:0});
        return res.status(201).send({status:true, data:data})

         
     } catch (error) {
         return res.status(500).send({status:false, message:error.message})
         
     }
 }

 module.exports = {createUrl,getCode}