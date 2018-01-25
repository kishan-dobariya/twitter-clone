let session =require('express-session');
let User = require('../models/users.models');
let Follower = require('../models/followers.models');
let Feed = require('../models/userfeed.models');

exports.homePageGet = async function(req, res) {
  if((req.session.sess === req.cookies.userToken) && req.session.sess !== undefined && req.cookies.userToken !== undefined){

    if(req.query.un == undefined){
      let user = await User.getUser({ username : req.session.username});
      let followercount = await Follower.getFollowers({ following : req.session.username, status : true});
      let followingcount = await Follower.getFollowers({ username : req.session.username, status : true});
      let followerslist = await Follower.searchUser({ username : req.session.username, status : true});
      console.log("--->",followerslist.length);
      let birthdate = formatDate(user.birthdate);
      let editedpath = editpath(user.imageURL);
      // let tweets = await Feed.getTweet({ username : req.session.username});
      // console.log("tweet",followerslist);
      let tweetArray = [,];
      followerslist.forEach(async function (follower, index) {
        console.log("55",follower.following);
        let tweet = await Feed.getTweet({ username : follower.following});
          // body...
          // console.log("tweet",tweet);
          console.log("index", indexs)
          tweetArray[index] = tweet;
          console.log("tweetArray-->",tweetArray);
        });
      console.log("tweetArray----->",tweetArray);
      res.render("home", {
        username : user.username,
        name : user.name,
        bio : user.bio,
        email : user.email,
        location : user.location,
        birthdate : birthdate,
        imgpath : editedpath,
        followers : followercount,
        folowings : followingcount,
        tweets : tweetArray,
      });
    }
    else {
      let user = await User.getUser({ username : req.query.un});
      let friendfollowercount = await Follower.getFollowers({ following : req.query.un, status : true});
      let friendfollowingcount = await Follower.getFollowers({ username : req.query.un, status : true});
      let status = await Follower.getFollower({username : req.session.username, following : req.query.un});
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
  if(req.file !== undefined){
    User.updateProfile({username : req.session.username}, req.body.name, req.body.bio, req.body.email, req.body.location, req.body.dob, req.file.path).then(console.log);
    res.redirect("/showprofile");
  }
  else{
    User.updateProfile({username : req.session.username}, req.body.name, req.body.bio, req.body.email, req.body.location, req.body.dob, "not difined").then(console.log);
    res.redirect("/showprofile");
  }
}

exports.addFollowerGet = async function(req, res) {
  let alreadyFollower = await Follower.getFollower( {username : req.session.username, following : req.body.un});
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
        res.send("Unfollow");
      }
    });
  }
  else{
    await Follower.updateStatus({ username : req.session.username, following : req.body.un,
    }, req.body.status).then(function(data){
      if (req.body.status !== "false") {
        res.send("Unfollow")
      }
      else {
        res.send("Follow");
      }
    })
  }
}

exports.searchGet = async function(req, res) {
  if(req.query.keyword != ""){
    let searchresult = await User.searchUser({ username : {$regex : ".*"+req.query.keyword+".*"}});
    let returnValue = "";
    searchresult.forEach(function (object) {
      returnValue = returnValue + "<li class='list-group-item'><a href='http://localhost:8080/home?un="+object.username+"'>"+object.username+"</a></li>";
    });
    res.send(returnValue);
  }
  else{
    res.send("");
  }
}
