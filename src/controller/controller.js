const shortid = require('shortid');
const urlmodel = require('../models/urlmodel')
const isUrl = require('isurl')



const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


const createUrl = async function (req, res) {

    let data = req.body

    let { longUrl } = data


    if(Object.keys(data).length == 0) {
        return res.status(400).send({status:false, message:'request body empty, please provide some details'})
    }

    if(!isValid(longUrl)){
        return res.status(400).send({status:false, message:'longurl is required in the body'})
    }

    if(!isValid.isUrl(longUrl)){
        return res.status(400).send({status:false, message:'longurl is not valod url'})
    }

    if(!(/^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/).test(longUrl)) {
        return res.status(400).send({status:false, message:'longurl is not a valid url'})
    }


    let code = shortid.generate()

    let createdata = await urlmodel.findOne({longUrl})

    let newdata = code + createdata

    let finaldata = await urlmodel.create(newdata)

return res.status(200).send({status:false, message:'successfully created', data:finaldata})

}

module.exports.createUrl = createUrl