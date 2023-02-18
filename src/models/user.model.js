const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { v1: uuidv1 } = require('uuid');

const secret_key = process.env.SECRET_KEY;

//mongoose schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide valid firstName'],
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide valid email'],
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide valid password'],
    minlength: 3,
    maxlength: 255
  },
  userId: {
    type: String,
    default: uuidv1,
    required: true,
    index: true
  },
  //give different access rights if admin or not 
  isAdmin: Boolean
});

// Mongoose Hooks
UserSchema.post('save', function (doc, next) {
  console.log('User created successfully');
  next();
});

UserSchema.pre('save', function (next) {
  console.log('User about to be crated & saved');
  next();
});

// custom method to generate authToken
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, email: this.email }, secret_key);
  return token;
}

const User = mongoose.model('User', UserSchema);

// function to validate user
const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().min(3).max(50).required(),
    lastName: Joi.string().alphanum().min(1).max(50),
    email: Joi.string().pattern(new RegExp('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required()
  });

  return schema.validate(user);
}

exports.User = User;

exports.validate = validateUser;