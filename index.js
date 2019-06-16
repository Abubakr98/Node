const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./app/models');
const config = require('./config');

const app = express(); 
config.express(app);
config.routes(app)

const {mongoUri, appPort} = config.app;
mongoose.connect(mongoUri, { useNewUrlParser: true })
.then(() => {
    app.listen(appPort, () => {
        console.log("server is running on port 3000...");
    });
})
.catch((err)=> console.error(`Erorr connection to mongodb: ${mongoUri}`, err));

