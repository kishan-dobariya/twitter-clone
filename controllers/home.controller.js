let session =require('express-session');
let User = require('../models/users.models');
let Follower = require('../models/followers.models');

exports.homePageGet = async function(req, res) {
  if((req.session.sess === req.cookies.userToken) && req.session.sess !== undefined && req.cookies.userToken !== undefined){

    if(req.query.un == undefined){
      let user = await User.getUser({ username : req.session.username});
      let followercount = await Follower.getFollowers({ following : req.session.username, status : true});
      // console.log("followers---->",followercount);
      let followingcount = await Follower.getFollowers({ username : req.session.username, status : true});
      // console.log("followers---->",followingcount);
      let birthdate = formatDate(user.birthdate);
      let editedpath = editpath(user.imageURL);
      res.render("home", {
        username : user.username,
        name : user.name,
        bio : user.bio,
        email : user.email,
        location : user.location,
        birthdate : birthdate,
        imgpath : editedpath,
        followers : followercount,
        folowings : followingcount
      });
    }
    else {
      let user = await User.getUser({ username : req.query.un});
      let friendfollowercount = await Follower.getFollowers({ following : req.query.un, status : true});
      // console.log("followers---->",followercount);
      let friendfollowingcount = await Follower.getFollowers({ username : req.query.un, status : true});
      // console.log("followers---->",followingcount);
      let status = await Follower.getFollower({username : req.session.username, following : req.query.un});
      // console.log("status",status);
      if(status === null){
        status = "Follow";
      }
      else {
        if(status.status == true){
          status = "Unfollow";
        }
        else {
          status = "Follow";
        }
      }
      // console.log("------",status);
      let birthdate = formatDate(user.birthdate);
      let editedpath = editpath(user.imageURL);
      res.render("friendprofile", {
        username : user.username,
        name : user.name,
        bio : user.bio,
        email : user.email,
        location : user.location,
        birthdate : birthdate,
        imgpath : editedpath,
        followers : friendfollowercount,
        folowings : friendfollowingcount,
        status : status,
      });
    }

  }
  else{
    res.redirect("/login");
  }
}

function editpath(url) {
  // body...
  if(url !== null && url !== undefined)
  return url.replace("public\\", "");
}

exports.showprofileGet = async function(req, res) {
  let user = await User.getUser({ username : req.session.username});
  let birthdate = formatDate(user.birthdate);
  let editedpath = editpath(user.imageURL);
  // console.log("editpath-->",editedpath)
  res.render('showprofile',{
    name : user.name,
    bio : user.bio,
    email : user.email,
    location : user.location,
    birthdate : birthdate,
    imgpath : editedpath,
  });
}

exports.editprofileGet = async function(req, res) {
  let user = await User.getUser({ username : req.session.username});
  let birthdate = formatDate(user.birthdate);
  let path = '/images/profilepics/'+req.session.username+".jpg";
  // console.log(path);
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
  // console.log("dfges");
  if(req.file !== undefined){
    // console.log("homec if");
    // console.log("file",req.file.path);
    User.updateProfile({username : req.session.username}, req.body.name, req.body.bio, req.body.email, req.body.location, req.body.dob, req.file.path).then(console.log);
    res.redirect("/showprofile");
  }
  // console.log("files",req.files);
  else{
    // console.log("homec else");
    User.updateProfile({username : req.session.username}, req.body.name, req.body.bio, req.body.email, req.body.location, req.body.dob, "not difined").then(console.log);
    // console.log("editprofilePost");
    // console.log(req.session.username);
    // console.log(req.body);
    // console.log(req.body.bio);
    res.redirect("/showprofile");
  }
}

exports.addFollowerGet = async function(req, res) {
  // console.log("aa",req.body.un);
  // console.log("aaa",req.session.username);
  // console.log("aaa",req.body.status);
  let alreadyFollower = await Follower.getFollower( {username : req.session.username, following : req.body.un});
  // console.log("duplicate",alreadyFollower);
  if(alreadyFollower == null){
    let newUser = Follower({
      username : req.session.username,
      following : req.body.un,
        status : req.body.status,
    });
    await Follower.createFollower(newUser, function(err, userInfo) {
      if(err) {
        throw err;
      }
      else{
        // console.log("Follower added",userInfo);
        // console.log("1111");
        res.send("Unfollow");
      }
    });
  }
  else{
    await Follower.updateStatus({ username : req.session.username, following : req.body.un,
    }, req.body.status).then(function(data){
      // console.log(data.ok);
      // console.log("----",req.body.status);
      if (req.body.status !== "false") {
        // console.log("iffffffffffffffffffffffffffff");
        res.send("Unfollow")
      }
      else {
        // console.log("elseeeeeeeeeeeee")
        res.send("Follow");
      }
    })
  }
}

exports.searchGet = async function(req, res) {
  // console.log("in searchGet-->",req.query.keyword);
  if(req.query.keyword != ""){
    let searchresult = await User.searchUser({ username : {$regex : ".*"+req.query.keyword+".*"}});
    // console.log("result-->",searchresult);
    let returnValue = "";
    // console.log("length-->",searchresult.length);
    searchresult.forEach(function (object) {
      // body...
      // console.log(object.username);
      returnValue = returnValue + "<li class='list-group-item'><a href='http://localhost:8080/home?un="+object.username+"'>"+object.username+"</a></li>";
      // console.log(returnValue);
    });
    // console.log("yy",returnValue);
    res.send(returnValue);
  }
  else{
    res.send("");
  }
}
