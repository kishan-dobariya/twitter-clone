let tempEmail;
let User = require('../models/users.models');
let bcrypt = require('bcrypt');
let jwt = require('Jsonwebtoken');
let cookie = require('cookie');
let session = require('express-session');
exports.loginGet = function (req, res) {
  res.render("login");
}

exports.checkSession = async function(req, res, next){
  if((req.session.sess !== undefined)) {
    res.redirect("/home");
  }
  else{
    next();
  }
}

exports.loginPost = async function (req, res) {
  let uname = req.body.username;
  let upassword = req.body.password;
  console.log(uname,upassword);
  let session_obj = req.session;
  //console.log("session------->",session_obj);
  let flag = false;
  let user = await User.getUser({ username : uname});
  console.log(user.password);
  await bcrypt.compare(upassword, user.password, function(err, res){
    flag = res;
    console.log("res--->",res);
  });
  console.log("flag--->",flag)
  if(flag){
    console.log("if");
    let token = jwt.sign({ email: user.email, name: user.name}, 'kkd');
    res.cookie("userToken", token);
    session_obj.sess = token;
    session_obj.username = user.username;
    // console.log("token-------->",user.username);
    // console.log("Current session-->",req.session.username);
    res.render('home');
  }
  else{
    console.log("else");
    res.render("login");
  }
  // console.log(">>>>>", user);
}

exports.logoutGet = function (req, res) {
  req.session.destroy();
  res.redirect("login");
}

exports.registrationGet = function (req, res) {
  res.render("registration");
}

exports.registrationPost = async function (req, res) {
  let uname = req.body.name;
  let uusername  = req.body.username;
  let upassword = req.body.password;
  let uemail = req.body.email;
  let userexistance = false;
  let encryptPassword, randomSalt;
  console.log(uname,uemail,upassword,uusername);
  let user = await User.getUser({ username : uusername});
  if(user){
    userexistance = true;
    //res.append("<h3>User Exist</h3>");
  }
  user = await User.getUser({ email : uemail});
  if(user){
    // console.log("email already exist");
    userexistance = true;
  }
  if(!userexistance){
    let newUser = new User({name  : uname, username : uusername,
                            email : uemail, password : upassword});
    await User.createUser(newUser, function(err, userInfo) {
      if(err) {
        throw err;
      }
      res.render('login', {
        msg : "Registration Successfull."
      });
    // console.log("----->", userInfo);
    });
  }
}

exports.resetpasswordGet = function (req, res) {
  res.render("getmail");
}

exports.resetpasswordPost = async function (req, res) {
  let uemail = req.body.email;
  let user = await User.getUser({email : uemail});
  if(user){
    tempEmail = uemail;
    res.render("setpassword");
  }
  else{
    res.render("getmail");
  }
}

exports.setpasswordPost = async function (req, res) {
  let upassword = req.body.password;
  let passWord = await User.updatePassword({email : tempEmail}, upassword).then(console.log);
     res.redirect('/login');
}

exports.homePageGet = function(req, res) {
  console.log(">111>>>>>", req.cookies['test18@gmail.com']);
  res.render("index", {
    title : "name"
  });
}
