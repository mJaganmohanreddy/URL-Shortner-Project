const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const route = require('./routes/routes.js');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://jaganreddy-functionup:ORj2ygJHT7jbS3y8@cluster0.nduth.mongodb.net/group22batchDatabase?retryWrites=true&w=majority", {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err));

app.use('/', route);

app.listen(process.env.PORT || 3000, (err) => {
    console.log("Connected to port 3000")
});

