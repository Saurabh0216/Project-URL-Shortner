const shortid = require('shortid')
const redis = require("redis");
const { promisify } = require("util");
const urlModel = require("../model/urlModel")

// connect redis 
const redisClient = redis.createClient(
    18639,
    "redis-18639.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("0XHF40jfCCk9plgI7bgCt411B2HZFDf3", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

// value validation 
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}

//Create ShortUrl API
const createUrl = async (req, res) => {

    try {
        const longUrl = req.body.longUrl
        const baseUrl = "http://localhost:3000"

        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, message: "Please Provide Url" })
        }

        //url validation check regex
        if (!(/http(s?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(longUrl))) {
            return res.status(400).send({ status: false, message: "Please Provide valid Url" })
        }
        const isUrlPresent = await urlModel.findOne({ longUrl: longUrl }).select({urlCode:1,longUrl:1,shortUrl:1})

        if (isUrlPresent) {
            return res.status(200).send({ status: true, message: "Short URL already created for this provide Long URL", data: isUrlPresent })
        } else {
            const urlCode = shortid.generate() // generate shortid for a request
            const shortUrl = baseUrl + '/' + urlCode

            //Create ShortUrl in Db
            const createShortUrl = await urlModel.create({ urlCode:urlCode, longUrl:longUrl, shortUrl:shortUrl })
           
            //Set Url in chaching
            await SET_ASYNC(`${longUrl}`, JSON.stringify(createShortUrl))
            return res.status(201).send({ status: true, message: "Short Url create sucessfully", data: createShortUrl })
        }


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};

//..................................Get url..................................//

const getCode = async (req, res) => {
    try {

        const urlCode = req.params.urlCode

        // Get url with Chaching
        const checkUrlData = await GET_ASYNC(`${req.params.urlCode}`)

        const urlparse = JSON.parse(checkUrlData)

        if (checkUrlData) {
            return res.status(302).redirect(urlparse.longUrl)
        }

        //if not find in case memory then it start finding in mongodb
        isUrlCodePresent = await urlModel.findOne({ urlCode: urlCode })

        if (!isUrlCodePresent) {
            return res.status(404).send({ status: false, message: "Url not found" })
        }

        const urlData = req.params.urlCode

        await SET_ASYNC(`${urlData}`, JSON.stringify(isUrlCodePresent))
        return res.status(302).redirect(isUrlCodePresent.longUrl)

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

module.exports = { createUrl, getCode }