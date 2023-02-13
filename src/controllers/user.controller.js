const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user.model");

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (error) {
    throw new Error(`Failed to get users ${error}`)
  }
};

module.exports.createUser = async (req, res) => {
  try {
    // validate the request body first
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //find an existing user
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ status: false, message: "User already registered." });

    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      email: req.body.email
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    const token = user.generateAuthToken();
    return res.status(200).header("x-auth-token", token).send({
      _id: user._id,
      email: user.email
    });
  } catch (error) {
    console.log(`Failed to create a new user ${error}`);
    return res.status(400).send({status: false, message: 'Failed to create user.'});
  }
};