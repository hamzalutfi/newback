const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "user must have email"],
      unique: [true, "email must be unique"],
      validate: [validator.isEmail, "please provide correct email"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "user must have password"],
      minlength: [8, "password length must be at least 8"],
      select: false, //
      validate: {
        validator: function (value) {
          return /(?=.*[a-zA-Z])(?=.*\d)/.test(value);
        },
        message: "password must have at least one letter and one number",
      },
    },
    confirmPassword: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return value === this.password;
        },
        message: "confirm password must be exactly same as password",
      },
    },
    role: {
      type: String,
      enum: ["donor", "disabled", "assistant"],
      default: "disabled",
    },
    invitedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    activationToken: String,
    activationTokenExpire: Date,
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,

    donor: {
      name: {
        type: String,
        //required: [true, "user must have name"],
      },
      birthDate: {
        type: Date,
        // required: true,
      },
      img: {
        type: String,
        // required: false,
      },
      donationPrivacy: {
        type: String,
        // required: false,
      },
      address: {
        type: String,
        //required: false,
      },
      phone: {
        type: String,
        // required: false,
      },
      gender: {
        type: String,
      },
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      showName: {
        type: String,
      },
      donationType: {
        type: String,
      },
    },
    disabled: {
      //from here
      name: {
        type: String,
        //required: [true, "user must have name"],
      },
      birthDate: {
        type: Date,
        // required: true,
      },
      img: {
        type: String,
        // required: false,
      },
      address: {
        type: String,
        //required: false,
      },
      phone: {
        type: String,
        // required: false,
      },
      gender: {
        type: String,
      },
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      disabilityType: {
        type: String,
      },
      medicalReport: {
        type: String,
      },
      needType: {
        type: String,
      },
      caseDescription: {
        type: String,
      },
    },
    assistant: {
      //from here
      name: {
        type: String,
        //  required: true,
      },
      birthDate: {
        type: Date,
        //required: true,
      },
      img: {
        type: String,
        // required: [true, "user must have name"],
      },
      address: {
        type: String,
        // required: true,
      },
      phone: {
        type: String,
        //required: true,
      },
      gender: {
        type: String,
        //required: true,
      },
      pass_id: {
        type: String,
        // required: true,
      },
      country: {
        type: String,
        // required: true,
      },
      city: {
        type: String,
      },
      pass_img: {
        type: String,
      },
      relation: {
        type: String,
      },
      idDocument: {
        type: String,
      },
    },
    //to here
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const highestId = await this.constructor.findOne().sort("-code").exec();
    this.code = highestId ? highestId.code + 1 : 1;
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//-------------------------------------------------------------------------------------------------

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkChangePassword = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changePasswordTime = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changePasswordTime;
  }

  return false;
};

userSchema.methods.createPasswordRestToken = function () {
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpire = Date.now() + 24 * 60 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createActivationToken = function () {
  const activateToken = Math.floor(100000 + Math.random() * 900000).toString();
  this.activationToken = crypto
    .createHash("sha256")
    .update(activateToken)
    .digest("hex");

  this.activationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
  return activateToken;
};

userSchema.methods.changePasswordAt = function (changePasswordAt) {
  this.changePasswordAt = changePasswordAt;
};

userSchema.methods.updateCurrentPassword = function (newPassword) {
  this.password = bcrypt.hash(newPassword, 12);
};
const Users = mongoose.model("user", userSchema);
module.exports = Users;

////// import mongoose driver

// const userSchema = new mongoose.Schema(
//   {
//     code: {
//       type: Number,
//     },
//     email: {
//       type: String,
//       required: [true, "user must have email"],
//       unique: [true, "email must be unique"],
//       validate: [validator.isEmail, "please provide correct email"],
//       trim: true,
//     },
// name: {
//   type: String,
//   required: [true, "user must have name"],
// },
//     password: {
//       type: String,
//       required: [true, "user must have password"],
//       minlength: [8, "password length must be at least 8"],
//       select: false,
//       validate: {
//         validator: function (value) {
//           return /(?=.*[a-zA-Z])(?=.*\d)/.test(value);
//         },
//         message: "password must have at least one letter and one number",
//       },
//     },
//     confirmPassword: {
//       type: String,
//       required: true,
//       validate: {
//         validator(value) {
//           return value === this.password;
//         },
//         message: "confirm password must be exactly same as password",
//       },
//     },
//     role: {
//       type: String,
//       enum: ["seller", "buyer", "admin"],
//       default: "buyer",
//     },
//     invitedBy: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: "user",
//     },
//     activationToken: String,
//     activationTokenExpire: Date,
//     passwordChangeAt: Date,
//     passwordResetToken: String,
//     passwordResetExpire: Date,
//     online: {
//       type: Boolean,
//       default: false,
//     },
//     lastOnline: {
//       type: Date,
//     },
//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "inactive",
//     },
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const highestId = await this.constructor.findOne().sort("-code").exec();
//     this.code = highestId ? highestId.code + 1 : 1;
//   }
//   next();
// });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }

//   this.password = await bcrypt.hash(this.password, 12);
//   this.confirmPassword = undefined;
// });

// userSchema.pre("save", function (next) {
//   if (!this.isModified("password") || this.isNew) {
//     return next();
//   }

//   this.passwordChangeAt = Date.now() - 1000;
//   next();
// });

// userSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });

// -------------------------------------------------------------------------------------------------

// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return bcrypt.compare(candidatePassword, userPassword);
// };

// userSchema.methods.checkChangePassword = function (JWTTimestamp) {
//   if (this.passwordChangeAt) {
//     const changePasswordTime = parseInt(
//       this.passwordChangeAt.getTime() / 1000,
//       10
//     );
//     return JWTTimestamp < changePasswordTime;
//   }

//   return false;
// };

// userSchema.methods.createPasswordRestToken = function () {
//   const resetToken = crypto.randomBytes(3).toString("hex");
//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.passwordResetExpire = Date.now() + 24 * 60 * 60 * 1000;
//   return resetToken;
// };

// userSchema.methods.createActivationToken = function () {
//   const activateToken = crypto.randomBytes(3).toString("hex");
//   this.activationToken = crypto
//     .createHash("sha256")
//     .update(activateToken)
//     .digest("hex");

//   this.activationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
//   return activateToken;
// };

// userSchema.methods.changePasswordAt = function (changePasswordAt) {
//   this.changePasswordAt = changePasswordAt;
// };

// userSchema.methods.updateCurrentPassword = function (newPassword) {
//   this.password = bcrypt.hash(newPassword, 12);
// };
// const Users = mongoose.model("user", userSchema);
// module.exports = Users;
