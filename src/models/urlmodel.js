const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({

    urlCode:
    {
        type: String,
        mandatory: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    longUrl: {
        type: String,
        mandatory: true,
        trim: true
    },

    shortUrl: {
        type: String,
        mandatory: true,
        unique: true,
        trim: true
    }

}, { timestamps: true })


module.exports = mongoose.model('createurl', urlSchema)