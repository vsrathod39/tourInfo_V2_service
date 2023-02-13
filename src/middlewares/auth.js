const jwt = require("jsonwebtoken");

const secret_key = process.env.SECRET_KEY;

module.exports = function (req, res, next) {
  //get the token from the header if present
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    token = token.split(' ')[1] // Remove Bearer from string
    if (token === 'null' || !token) return res.status(401).send('Unauthorized request');

    let verifiedUser = jwt.verify(token, secret_key);   // config.TOKEN_SECRET => 'secretKey'
    if (!verifiedUser) return res.status(401).send('Unauthorized request')

    req.user = verifiedUser; // user_id & user_type_id
    next();
  } catch (error) {
    console.log("Invalid Token:", error);
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