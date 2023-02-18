const bunyan = require('bunyan');

const logger = bunyan.createLogger({name: 'tourInfoService'});

module.exports = logger;