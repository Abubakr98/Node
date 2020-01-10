const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// const bodyParser = require('body-parser');
require('./app/models');
const config = require('./config');

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
config.express(app);
config.routes(app);
app.use(express.static(`${__dirname}/public`));
const { mongoUri, appPort } = config.app;
mongoose.connect(mongoUri, { useNewUrlParser: true })
  .then(() => {
    app.listen(appPort, () => {
      console.log('server is running on port 3000...');
    });
  })
  .catch(err => console.error(`Error connection to mongodb: ${mongoUri}`, err));
