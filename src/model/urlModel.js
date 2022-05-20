const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
    {
   urlCode :{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true

    },

    longUrl:{
        type: String,
        required:true,
        trim:true,
        match: /http(s?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
    },
    shortUrl:{
        type:String,
        unique:true,
        required:true
    }
},
   // {timestamps:true}
);
   

module.exports = mongoose.model('Url', urlSchema);