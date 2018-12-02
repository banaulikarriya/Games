const mongoose = require("mongoose");
const User = require("../model/userModel");
var bcrypt = require("bcryptjs");

//load login page
async function getlogin(req, res) {
  res.render("login", { menuFalse: true });
}

//load register page
async function getRegister(req, res) {
  res.render("Register", { menuFalse: true });
}

//function to add user
async function addUser(req, res) {
  let data = req.body;
  if (data.password != data.confim) {
    res.render("register", {
      menuFalse: true,
      err: "Password and confirm did not match"
    });
    return;
  }
  try {
    // find if email already exists.
    let existingUserEmail = await User.find({ email: data.email }).exec();
    if (existingUserEmail.length) {
      var errMsg = "Email already exists";
      res.render("register", { menuFalse: true, err: errMsg });
      return;
    }

    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(data.password, salt);
    data.password = hashPassword;
    let userData = new User(data);
    let user = await userData.save();
    res.render("login", { menuFalse: true, msg: "User successfully register" });
  } catch (e) {
    var errMsg = `There was Error ${e}\n`;
    res.render("register", { menuFalse: true, err: errMsg });
  }
}

//login function
async function login(req, res) {
  let data = req.body;
  try {
    let userDetails = await User.findOne({ email: data.email }).exec();
    let matchPass = await bcrypt.compare(data.password, userDetails.password);

    if (!matchPass) {
      var errMsg = "Password Incorrect";
      res.render("login", { menuFalse: true, err: errMsg });
      return;
    }
    if (matchPass) {
      res.redirect("../tournaments");
    } else {
      var errMsg = "login was unsuccessfull please try again";
      res.render("login", { menuFalse: true, err: errMsg });
    }
  } catch (e) {
    var errMsg = "login was unsuccessfull please try again";
    res.render("login", { menuFalse: true, err: errMsg });
  }
}
module.exports = {
  getlogin,
  getRegister,
  addUser,
  login
};
