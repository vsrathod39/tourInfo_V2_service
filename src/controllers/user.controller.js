const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user.model");
const { handleError } = require("../utils/error-handling");
const logger = require("../utils/bunyanLogger");

module.exports.getUser = async (req, res) => {
  try {
    logger.info(`Started fetching user by user id: ${req.user._id}`);
    const user = await User.findById(req.user._id).select("-password");
    logger.info(`Successfully fetched user by user`);
    res.send(user);
  } catch (err) {
    logger.info(`Failed to fetch user. Error: ${err}`);
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
    return res.status(201).header("x-auth-token", token).json({
      _id: user._id,
      email: user.email,
      userId: user.userId
    });
  } catch (error) {
    console.log(`Failed to create a new user`);
    const errors = handleError(error);
    return res.status(400).json(errors);
  }
};