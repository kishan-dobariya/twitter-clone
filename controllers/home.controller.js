let session =require('express-session');
let User = require('../models/users.models');

exports.homePageGet = function(req, res) {
  if((req.session.sess === req.cookies.userToken) && req.session.sess !== undefined && req.cookies.userToken !== undefined){
    // console.log("yup");
    // console.log("session------>",req.session.sess);
    res.render("home");
  }
  else{
    res.redirect("/login");
  }
}

exports.editprofileGet = async function(req, res) {
  let user = await User.getUser({ username : req.session.username});
  let birthdate = formatDate(user.birthdate);
  let path = '/images/profilepics/'+req.session.username+".jpg";
  console.log(path);
  res.render('editprofile',{
    name : user.name,
    bio : user.bio,
    email : user.email,
    location : user.location,
    birthdate : birthdate,
    imgpath : path
  });
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


exports.editprofilePost = async function(req, res) {
  //res.render('editprofile');
  console.log("file",req.file);
  console.log("files",req.files);
  console.log("editprofilePost");
  console.log(req.session.username);
  console.log(req.body);
  console.log(req.body.bio);
   User.updateProfile({username : req.session.username}, req.body.name, req.body.bio, req.body.email, req.body.location, req.body.dob).then(console.log);

   res.redirect("/editprofile");
 }
