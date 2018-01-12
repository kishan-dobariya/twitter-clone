let User = require('../models/users.models');
exports.loginGet = function (req, res) {
  res.render("login");
}
exports.loginPost = async function (req, res) {
  let uname = req.body.username;
  let upassword = req.body.password;
  console.log(uname,upassword);
  let user = await User.getUser({ $and : [ { username : uname}, {password : upassword}]});
  console.log(">>>>>", user);
  if(user){
    console.log("if");
    res.render("index", {
      title : user.name
    });
  }
  else{
    console.log("else");
    res.redirect("/login");
  }
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
  console.log(uname,uemail,upassword,uusername);

  let user = await User.getUser({ username : uusername});

  if(user){
    userexistance = true;
    //console.log("username already exist");
    res.append("<h3>User Exist</h3>");
  }
  user = await User.getUser({ email : uemail});
  if(user){
    console.log("email already exist");
    userexistance = true;
  }

  if(!userexistance){
    let newUser = new User({name  : uname, username : uusername,
                            email : uemail, password : upassword});
    User.createUser(newUser, function(err, userInfo) {
      if(err) {
        throw err;
      }
      res.render('login');
    //console.log("----->", userInfo);
    });
  }
  //res.send(200);
}
