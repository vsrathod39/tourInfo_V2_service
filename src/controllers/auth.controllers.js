const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require("../models/user.model");

const secret_key = process.env.SECRET_KEY;

module.exports.signup = (req, res) => {

};

module.exports.login = async (req, res) => {
  try {
    const { email = '', password = '' } = req.body;
    const user = await User.findOne({ email }).lean().exec();
    if (user) {
      const isValidPass = await bcrypt.compare(password, user.password);
      if (isValidPass) {
        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin, email: user.email }, secret_key);
        return res.status(200).header("x-auth-token", token).send({status: true, token: token });
      }
    }
    return res.status(401).send("Email or Password is wrong.");
  } catch (error) {
    console.log("Failed to authenticate:", error);
    return res.status(401).send({status: false, message: "Failed to authenticate."});
  }
};