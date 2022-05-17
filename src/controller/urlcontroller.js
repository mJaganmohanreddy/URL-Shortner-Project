const shortid = require('shortid');
const urlmodel = require('../models/urlmodel')
const validUrl = require('valid-url')



const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


const createUrl = async function (req, res) {

    try {
        let data = req.body

        let { longUrl } = data


        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, message: 'request body empty, please provide some details' })

        if (!isValid(longUrl))
            return res.status(400).send({ status: false, message: 'longurl is required in the body' })

        if (!validUrl.isUri(longUrl))
            return res.status(400).send({ status: false, message: 'longurl is not valod url' })

        let findUrl = await urlmodel.findOne({ longUrl: longUrl.trim() })

        if(Object.keys(findUrl).length > 0) return res.status(404).send({status : false, message : "Already shortend the link"})

        let SHORTID = shortid.generate()
        let shortId = SHORTID.toLowerCase()

        let findShorternedId = await findOne({urlCode : shortUrl})

        if(Object.keys(findShorternedId).length > 0) return res.status(404).send({status : false,message : "Hit the Api again"})

        let baseURL = "http://localhost:3000"

        let shortLink = baseURL + `/` + shortUrl

        data.urlCode = shortId
        data.shortURL = shortLink
        
        let createDoc = await urlmodel.create(data)

        return res.status(200).send({ status: false, message: 'successfully created', data: createDoc })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


let getData = async (req,res) => {
    try{
        let urlCode = req.params.urlCode
        let findUrl = await findOne({urlCode : urlCode})

        if(Object.keys(findUrl.length == 0)) return res.status(302).send({status :false, message : "Invalid code"})

        res.status(302).redirect(findUrl.longUrl)
    }
    catch(error){
        res.status(500).send({status :false, message : error.message})
    }
}
module.exports.createUrl = createUrl