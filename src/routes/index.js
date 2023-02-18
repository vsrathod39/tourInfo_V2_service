const app = require('express')();
const authenticate = require("../middlewares/authenticate");

// open rotes
app.use(authenticate)

// authenticated routs
app.use('/user', require('./user.route'));

module.exports = app;