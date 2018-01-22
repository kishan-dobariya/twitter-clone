let session =require('express-session');
let User = require('../models/users.models');

exports.homePageGet = async function(req, res) {
  if((req.session.sess === req.cookies.userToken) && req.session.sess !== undefined && req.cookies.userToken !== undefined){
    let user = await User.getUser({ username : req.session.username});
    let birthdate = formatDate(user.birthdate);
    let editedpath = editpath(user.imageURL);
    console.log("editpath-->",editedpath)
    res.render("home", {
      username : user.username,
      name : user.name,
      bio : user.bio,
      email : user.email,
      location : user.location,
      birthdate : birthdate,
      imgpath : editedpath
    });
  }
  else{
    res.redirect("/login");
  }
}

function editpath(url) {
  // body...
  if(url !== null)
  return url.replace("public\\", "");
}

exports.showprofileGet = async function(req, res) {
  let user = await User.getUser({ username : req.session.username});
  let birthdate = formatDate(user.birthdate);
  let editedpath = editpath(user.imageURL);
  console.log("editpath-->",editedpath)
  //let path = '/images/profilepics/'+req.session.username+".jpg";
  //console.log(path);
  res.render('showprofile',{
    name : user.name,
    bio : user.bio,
    email : user.email,
    location : user.location,
    birthdate : birthdate,
    imgpath : editedpath
  });
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
  console.log("dfges");
  if(req.file !== undefined){
    console.log("homec if");
    console.log("file",req.file.path);
    User.updateProfile({username : req.session.username}, req.body.name, req.body.bio, req.body.email, req.body.location, req.body.dob, req.file.path).then(console.log);
    res.redirect("/showprofile");
  }
  //console.log("files",req.files);
  else{
    console.log("homec else");
    User.updateProfile({username : req.session.username}, req.body.name, req.body.bio, req.body.email, req.body.location, req.body.dob, "not difined").then(console.log);
    console.log("editprofilePost");
    console.log(req.session.username);
    console.log(req.body);
    console.log(req.body.bio);
    res.redirect("/showprofile");
  }


 }
