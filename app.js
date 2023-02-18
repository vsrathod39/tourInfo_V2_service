const express = require('express');
require('dotenv').config();
const logger = require('./src/utils/bunyanLogger');
const connectDatabase = require('./dbConnection/connection');

const port = process.env.PORT || 4001;

// Express app instance
const app = express();

// Routes
app.use('/api', require('./src/routes/index'));

// middleware
app.use(express.json());
app.use(express.static('public'));  // setting up public folder
// app.use('view engine', 'ejs'); // setting up view engine

// db connection
connectDatabase(app);

// listen app when mongoose connected successfully
app.on('ready', function () {
  app.listen(port, () => {
    logger.info(`tourInfo service running successfully on port ${port}`);
  });
});