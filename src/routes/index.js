const app = require('express')();
const authenticate = require("../middlewares/authenticate");

// public rotes


// authenticated routs
app.use(authenticate);
app.use('/user', require('./user.route'));

module.exports = app;