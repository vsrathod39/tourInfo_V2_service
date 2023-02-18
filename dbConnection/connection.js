const mongoose = require('mongoose');
const logger = require('../src/utils/bunyanLogger');

const connectDatabase = (app) => {
  const dbUrl = `mongodb+srv://tourappmay2022:${process.env.MONGODB_PASSWORD}@cluster0.hwkx9.mongodb.net/${process.env.MOGNODB_DB}`;
  const localHost = 'mongodb://localhost:27017/tourInfo_v2';
  const env = process.env.ENV

  mongoose.set('strictQuery', false);
  mongoose.connect(env === 'DEV' ? localHost : dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('error', function (err) {
    logger.info(`facing issues while connecting to db`);
  });

  mongoose.connection.once('open', function () {
    // All OK - fire (emit) a ready event. 
    app.emit('ready');
  });
};

module.exports = connectDatabase;