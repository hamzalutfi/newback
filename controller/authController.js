const user = require("../models/user");
const { sendActivationEmail } = require("../utils/SendEmail");
const { sendResetPasswordEmail } = require("./../utils/SendEmail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { jwtDecode } = require("jwt-decode");
const _ = require("lodash");
const Joi = require("joi");

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password'),"confirm password must be exactly same as password").required(),
  role: Joi.string().valid('donor', 'disabled', 'assistant').required(), // Example roles
  
});
exports.signup = async (req, res) => {
  
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const createdUser = await user.create({ email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      role: req.body.role,});
    console.log("req.body",req.body) //create user from the info in req.body
    
    const userToken = await createdUser.createActivationToken(); //HERE we create the activation token
    console.log("userToken", userToken);
    await sendActivationEmail({
      email: createdUser.email,
      token: userToken,
    });
    createdUser.save({ validateBeforeSave: false });
    res.send("done");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), 
  status: Joi.string().valid("active", "inactive").optional(),// Adjust password length as needed
});
exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const { email, password } = req.body;
    const currentUser = await user
      .findOne({ email })
      .select("+password status");
    console.log(currentUser);
    if (!currentUser) {
      return res.status(500).send("user not found");
    }
    const correctPassword = await currentUser.correctPassword(
      password,
      currentUser.password
    );
    console.log(correctPassword);
    if (!correctPassword) {
      return res.status(500).send("wrong password");
    }
    if (currentUser.status === "inactive") {
      return res.status(500).send("user is inactive");
    }
    const userToken = jwt.sign(
      {
        id: currentUser._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: 3 * 24 * 60 * 60 * 1000,
      }
    );
    res.send(userToken);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const curruntUser = await user.findOne({ email });

    if (!curruntUser) {
      res.status(500).send("there is no user found");
      return;
    }
    const userToken = curruntUser.createPasswordRestToken();
    sendResetPasswordEmail({
      email: curruntUser.email,
      restToken: userToken,
    });
    console.log(userToken);
    curruntUser.save({ validateBeforeSave: false });
    res.send("done");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
exports.resendactivationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUser = await user.findOne({ email });
    if (!currentUser) {
      res.status(500).send("there is no user found");
      return;
    }
    const userToken = currentUser.createActivationToken(); // take the token from method in user model
    await sendActivationEmail({
      // make activate for email
      email: currentUser.email,
      token: userToken,
      name: currentUser.userName,
    });
    currentUser.save({ validateBeforeSave: false });
    console.log(userToken);
    res.send("done");
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.activate = async (req, res) => {
  try {
    const { email, token } = req.body;
    const updatedToken = token.join("");
    const currUser = await user.findOne({ email });
    console.log(req.body);
    console.log(currUser);
    console.log(updatedToken);
    if (!currUser) {
      res.status(500).send("the user does not exist");
      return;
    }

    const tokenHashed = crypto
      .createHash("sha256")
      .update(updatedToken)
      .digest("hex");
    console.log(tokenHashed);
    console.log(currUser.activationToken);
    if (currUser.activationToken !== tokenHashed) {
      res.status(500).send("the token does not match");
      return;
    }
    currUser.status = "active";
    currUser.save({ validateBeforeSave: false });
    res.send("done");
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, password, confirmPassword } = req.body;
    console.log("req.body", req.body);
    const currrUser = await user.findOne({ email }).select("+password");
    console.log("currrUser", currrUser);
    if (!currrUser) {
      res.status(500).send("there is no user found");
      return;
    }
    const newToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("newToken", newToken);
    console.log("currrUser.passwordResetToken", currrUser.passwordResetToken);
    if (currrUser.passwordResetToken !== newToken) {
      res.status(500).send("token not match");
      return;
    }

    currrUser.password = password;
    currrUser.confirmPassword = confirmPassword;

    currrUser.save();
    res.send(currrUser.password);
  } catch (e) {
    res.status(500).send(e);
  }
};
// Validation schema for password change
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).required().messages({
    'string.min': 'Old password must be at least 8 characters long.',
    'any.required': 'Old password is required.',
  }),
  password: Joi.string().min(8).required().pattern(/(?=.*[a-zA-Z])(?=.*\d)/).messages({
    'string.min': 'New password must be at least 8 characters long.',
    'string.pattern.base': 'New password must contain at least one letter and one number.',
    'any.required': 'New password is required.',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match the new password.',
    'any.required': 'Confirm password is required.',
  }),
});
exports.changePassword = async (req, res) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const { _id } = req.user;
    const { oldPassword, password, confirmPassword } = req.body;

    const currrUser = await user.findById(_id).select("+password");
    if (!currrUser) {
      res.status(500).send("there is no user found");
      return;
    }
    if (!bcrypt.compareSync(oldPassword, currrUser.password)) {
      res.status(500).send("old password not match");
      return;
    }

    currrUser.password = password;
    currrUser.confirmPassword = confirmPassword;

    currrUser.save();
    res.send(currrUser.password);
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.me = async (req, res) => {
  const token = req.headers["authorization"];
  const userToken = token?.split(" ")[1];
  const { id } = jwtDecode(userToken);
  console.log(id);
  console.log(id);

  const currenttUser = await user.findOne({ _id: id });
  if (!currenttUser) {
    res.status(500).send("user not found");
    return;
  }
  res.send(currenttUser);
  //console.log(token)
};

exports.deleteCurrentUser = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).send("Authorization token missing");

    const userToken = token.split(" ")[1];
    const { id } = jwtDecode(userToken);

    const deletedUser = await user.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).send("User not found");

    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
const updateUserSchema = Joi.object({
  status: Joi.string().valid("active", "inactive").optional(),
  
  donor: Joi.object({
    name: Joi.string(),
    birthDate: Joi.date(),
    img: Joi.string(),
    donationPrivacy: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    gender: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    showName: Joi.string(),
    donationType: Joi.string(),
  }).optional(),
  // Fields for disabled
  disabled: Joi.object({
    name: Joi.string(),
    birthDate: Joi.date(),
    img: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    gender: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    disabilityType: Joi.string(),
    medicalReport: Joi.string(),
    needType: Joi.string(),
    caseDescription: Joi.string(),
  }).optional(),
  // Fields for assistant
  assistant: Joi.object({
    name: Joi.string(),
    birthDate: Joi.date(),
    img: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    gender: Joi.string(),
    pass_id: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    pass_img: Joi.string(),
    relation: Joi.string(),
    idDocument: Joi.string(),
  }).optional(),
  _id: Joi.string(),
  email: Joi.string(),
  role: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  code: Joi.number(),
  __v: Joi.number(),
  invitedBy: Joi.string(),
  activationToken: Joi.string(),
  activationTokenExpire: Joi.date(),
  passwordChangeAt: Joi.date(),
  passwordResetToken: Joi.string(),
  passwordResetExpire: Joi.date(),

}).messages({
  'object.base': 'Invalid input format.',
});


exports.updateCurrentUser = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).send("Authorization token missing");
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const userToken = token.split(" ")[1];
    const { id } = jwtDecode(userToken);
    const info = req.body;
    console.log(info);
    console.log(req.files);
    if (req.files) {
      const { files } = req;
      files.forEach((file) => {
        const normalizedFieldname = file.fieldname.replace(/\[(\w+)\]/g, ".$1");
        _.set(info, normalizedFieldname, file.path);
      });
    }
    console.log(info);
    const updatedUser = await user.findByIdAndUpdate(id, { $set: info });
    console.log(updatedUser);
    if (!updatedUser) return res.status(404).send("User not found");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
