let tempEmail;
let User = require('../models/users.models');
let bcrypt = require('bcrypt');
let jwt = require('Jsonwebtoken');
let cookie = require('cookie');
exports.loginGet = function (req, res) {
  res.render("login");
}
exports.loginPost = async function (req, res) {
  let uname = req.body.username;
  let upassword = req.body.password;
  console.log(uname,upassword);
  let user = await User.getUser({ username : uname});
  if(bcrypt.compare(upassword, user.password)){
    console.log("if");
    let token = jwt.sign({ email: user.email, name: user.name}, 'kkd');
    res.cookie(user.email, token);
    res.json({token:token})
    console.log("token-------->",token);
    res.redirect('/home');
  }
  else{
    console.log("else");
    res.redirect("/login");
  }
  console.log(">>>>>", user);
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
    console.log("email already exist");
    userexistance = true;
  }
  if(!userexistance){
    let newUser = new User({name  : uname, username : uusername,
                            email : uemail, password : upassword});
    await User.createUser(newUser, function(err, userInfo) {
      if(err) {
        throw err;
      }
      res.render('login');
    console.log("----->", userInfo);
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
    console.log("email not found");
    res.render("getemail");
  }
}
exports.setpasswordPost = async function (req, res) {
  let upassword = req.body.password;
  await User.updatePassword({email : tempEmail}, upassword, function(err, userInfo) {
    if(err) {
      throw err;
    }
    res.redirect("/login");
  });
}
exports.homePageGet = function(req, res) {
  console.log(">111>>>>>", req.cookies['test18@gmail.com']);
  res.render("index", {
    title : "name"
  });
}
