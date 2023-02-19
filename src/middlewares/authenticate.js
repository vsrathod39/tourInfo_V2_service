const jwt = require("jsonwebtoken");
const logger = require("../utils/bunyanLogger");

const secret_key = process.env.SECRET_KEY;

module.exports = function (req, res, next) {

  logger.info(`User authentication started`);
  //get the token from the header if present
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  //if no token found, return response (without going to the next middelware)
  if (!token) {
    logger.info(`User authentication failed, Access denied. No token provided`);
    return res.status(401).send("Access denied, No token provided");
  }

  try {
    token = token.split(' ')[1]; // Remove Bearer from string
    if (token === 'null' || !token) return res.status(401).send('Unauthorized request');

    let verifiedUser = jwt.verify(token, secret_key);   // config.TOKEN_SECRET => 'secretKey'
    if (!verifiedUser) return res.status(401).send('Unauthorized request')

    req.user = verifiedUser; // user_id & user_type_id
    logger.info(`User authentication successful with userId #${verifiedUser._id}`);
    next();
  } catch (err) {
    logger.info(`User authentication failed, Invalid Token. Error: ${err}`);
    res.status(400).send("Invalid Token");
  }
};

exports.IsUser = async (req, res, next) => {
  if (req.user.user_type_id === 0) {
    next();
  }
  return res.status(401).send("Unauthorized!");
}

exports.IsAdmin = async (req, res, next) => {
  if (req.user.user_type_id === 1) {
    next();
  }
  return res.status(401).send("Unauthorized!");

}