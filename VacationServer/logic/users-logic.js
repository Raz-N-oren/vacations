let usersDal = require('../dal/users-dal');
const crypto = require("crypto");

const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const likesLogic = require('../logic/likes-logic');

const saltRight = "sdkjfhdskajh";
const saltLeft = "--mnlcfs;@!$ ";

async function addUser(userRegistrationData) {
  validateUserData(userRegistrationData);
  if (await usersDal.isUserNameExist(userRegistrationData.email)) {
    throw new Error("User name already exist");
  }

  normalizeOptionalData(userRegistrationData);

  userRegistrationData.password = hashPassword(userRegistrationData.password);
  userRegistrationData.userType = "user";
  let newUser = await usersDal.addUser(userRegistrationData);
  return newUser;
}

async function loginUser(user) {
  user.password = hashPassword(user.password);
  console.log("Hashed password : " + user.password);

  let userDetails = await usersDal.loginUser(user)
  if (!userDetails) {
    throw new Error("Invalid E-mail or password");
  }
  let likesArray = await likesLogic.getUserLikes(userDetails.id);

  let userIdAndType = { userId: userDetails.id, userType: userDetails.userType };
  const token = jwt.sign(userIdAndType, config.secret);
  const logInResponse = { token: token, firstName: userDetails.firstName, lastName: userDetails.lastName, userLikes: likesArray, userType: userDetails.userType };

  return logInResponse;
}

function hashPassword(password) {
  let hashedPassword = crypto.createHash("md5").update(saltLeft + password + saltRight).digest("hex");
  return hashedPassword
}

function validateUserData(userRegistrationData) {
  let format = /[^a-zA-Z]/g;
  if (!userRegistrationData.email) {
    throw new Error("Invalid user name or password");
  }

  if (!userRegistrationData.password) {
    throw new Error("Invalid user name or password");
  }

  if (userRegistrationData.password.length < 6 || userRegistrationData.password.length > 12) {
    throw new Error("Password must contain 6 to 12 characters");
  }

  if (format.test(userRegistrationData.firstName)) {
    throw new Error("First Name must contain only Letters")
  }

  if (!userRegistrationData.firstName || userRegistrationData.firstName.length < 3) {
    throw new Error("Please enter first name . (At least 3 characters)")
  }

  if (format.test(userRegistrationData.lastName)) {
    throw new Error("Last Name must contain only Letters")
  }

}

function normalizeOptionalData(userRegistrationData) {
  if (!userRegistrationData.lastName) {
    userRegistrationData.lastName = "";
  }
}

module.exports = {
  addUser,
  loginUser
};