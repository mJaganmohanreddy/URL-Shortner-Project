const shortid = require('shortid');
const urlmodel = require('../models/urlmodel')
const redisModule = require('../redisServer')
const validUrl = require('valid-url')
const { promisify } = require('util')



const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


//Connection setup for redis

const SET_ASYNC = promisify(redisModule.redisClient.SET).bind(redisModule.redisClient)
const GET_ASYNC = promisify(redisModule.redisClient.GET).bind(redisModule.redisClient)

// Logic to short link

const createUrl = async function (req, res) {

    try {
        let data = req.body

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, message: 'request body empty, please provide some details' })

        if (!isValid(data.longUrl))
            return res.status(400).send({ status: false, message: 'longurl is required in the body' })

        if (!validUrl.isUri(data.longUrl))
            return res.status(400).send({ status: false, message: 'longUrl is not valid url' })

        let getFromCache = await GET_ASYNC(`${data.longUrl}`)

        if(getFromCache) return res.status(201).send({status : true, data : JSON.parse(getFromCache)})

        let findlongUrl = await urlmodel.findOne({longUrl : data.longUrl},{_id:0, createdAt:0, updatedAt: 0, __v:0})

        if(findlongUrl){ 
            await SET_ASYNC(`${data.longUrl}`, JSON.stringify({longUrl : findlongUrl.longUrl, shortUrl : findlongUrl.shortUrl, urlCode : findlongUrl.urlCode}))
            return res.status(200).send({status :true, data : {longUrl : findlongUrl.longUrl, shortUrl : findlongUrl.shortUrl, urlCode : findlongUrl.urlCode}})
        }

        let SHORTID = shortid.generate()
        let shortId = SHORTID.toLowerCase()

        let baseURL = "http://localhost:3000" 

        let shortLink = baseURL + `/` + shortId

        data.urlCode = shortId
        data.shortUrl = shortLink

        let createDoc = await urlmodel.create(data)
        let setintcache = JSON.stringify({longUrl : createDoc.longUrl, shortUrl :createDoc.shortUrl, urlCode : createDoc.urlCode})
        await SET_ASYNC(`${data.longUrl}`,`${setintcache}`)

        return res.status(200).send({ status: false, data : {longUrl : createDoc.longUrl, shortUrl :createDoc.shortUrl, urlCode : createDoc.urlCode} })

    } catch (error) {

        console.log(error)
        res.status(500).send({ status: false, message: error.message })
    }
}

// Logic to get link

let getData = async (req,res) => {
    try{
        let urlCode = req.params.urlCode

        let getData = await GET_ASYNC(`${urlCode}`)

        if(getData) return res.redirect(JSON.parse(getData))
        
        let findUrl = await urlmodel.findOne({urlCode : urlCode})

        if(!findUrl) return res.status(404).send({status :false, message : "Invalid code"})

        let setData = JSON.stringify(findUrl.longUrl)

        await SET_ASYNC(`${urlCode}`, setData)

        res.redirect(findUrl.longUrl)
    }
    catch(error){

        res.status(500).send({status :false, message : error.message})
    }
}

module.exports.createUrl = createUrl
module.exports.getData = getData