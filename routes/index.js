const express = require('express');
let session =require('express-session');
const path = require('path');
var multer  = require('multer');

const userController = require('../controllers/user.controller.js');
const homeController = require('../controllers/home.controller.js');
const feedController = require('../controllers/feed.controller.js');

const router = express.Router();
const storage = multer.diskStorage({
  destination: 'public/images/profilepics/',
  filename: function(req, file, callback){
    callback(null, req.session.username+path.extname(file.originalname));
  }
});
const upload = multer({
  storage : storage
});


router.get('/login', checkSessionLogin, userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/logout', userController.logoutGet);
router.get('/registration', userController.registrationGet);
router.post('/registration', userController.registrationPost);
router.get('/resetpassword', userController.resetpasswordGet);
router.post('/resetpassword', userController.resetpasswordPost);
router.post('/setpassword', userController.setpasswordPost);
router.get('/home',checkSession, homeController.homePageGet);
router.get('/',checkSession, homeController.homePageGet);
router.get('/showprofile',checkSession, homeController.showprofileGet);
router.get('/editprofile',checkSession, homeController.editprofileGet);
router.post('/editprofile',checkSession, upload.single('profilepicture'), homeController.editprofilePost);
router.post('/follow',checkSession, homeController.addFollowerGet);
router.get('/search',checkSession, homeController.searchGet);
router.post('/insertfeed',checkSession, feedController.insertPost);
router.post('/edittweet',checkSession, feedController.edittweetPost);
router.post('/getfollowing',checkSession, homeController.getfollowingPost);
router.post('/getfollowers',checkSession, homeController.getfollowersPost);
router.post('/getTweet',checkSession, homeController.getTweetPost);
router.post('/like',checkSession, homeController.likePost);
module.exports = router;

function checkSession(req, res, callback){
  if((req.session.sess == undefined)) {
    res.redirect("/login");
  }
  else{
    callback();
  }
}

function checkSessionLogin(req, res, next){
  if((req.session.sess !== undefined)) {
    res.redirect("/home");
  }
  else{
    next();
  }
}
