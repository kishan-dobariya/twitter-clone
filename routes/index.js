const express = require('express');
const path = require('path');
var multer = require('multer');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const userController = require('../controllers/user.controller.js');
const homeController = require('../controllers/home.controller.js');
const feedController = require('../controllers/feed.controller.js');
const app = require('../app.js');

const router = express.Router();
const storage = multer.diskStorage({
	destination: 'public/images/profilepics/',
	filename: function (req, file, callback) {
		callback(null, req.session.username + path.extname(file.originalname));
	}
});
const upload = multer({
	storage: storage
});

router.get('/', (req, res) => { res.redirect('/login'); });

router.get('/login', userController.loginGet);

router.post('/login', passport.authenticate('local', { 	successRedirect: '/home',
	failureRedirect: '/login' }));
// LOGOUT ACTION
router.get('/logout', (req, res) => { req.logout(); res.redirect('/login'); });
// REDIRECT TO REGISTRATION PAGE
router.get('/registration', userController.registrationGet);
// REGISTRATION POST REQUEST
router.post('/registration', userController.registrationPost);
// MAIL VERIFICATION REQUEST
router.get('/verifyaccount', userController.verifyaccountGet);
// REDIRECT TO PASSWORD RESET PAGE
router.get('/resetpassword', userController.resetpasswordGet);
// REDIRECT TO MAIL VERIFICATION
router.post('/resetpassword', userController.resetpasswordPost);
// REDIRECT TO SET NEW PASSWORD PAGE
router.post('/setpassword', userController.setpasswordPost);
// REDRECT TO HAME PAGE
router.get('/home', require('connect-ensure-login').ensureLoggedIn(),
	homeController.homePageGet);
// SHOW USER PROFILE
router.get('/showprofile', require('connect-ensure-login').ensureLoggedIn(),
	homeController.showprofileGet);
// SHOW OTHER USER'S PROFILE
router.get('/showFriendProfile', require('connect-ensure-login').ensureLoggedIn(),
	homeController.showFriendProfileGet);
// router.get('/editprofile', homeController.editprofileGet);
// EDIT USER'S PROFILE
router.post('/editprofile', upload.single('profilepicture'),
	homeController.editprofilePost);
// MAKE FOLLOW-UNFOLLOW
router.post('/follow', require('connect-ensure-login').ensureLoggedIn(),
	homeController.addFollowerGet);
// SHOW SEARCHED USER IN DROPDOWN LIST
router.get('/search', require('connect-ensure-login').ensureLoggedIn(),
	homeController.searchGet);
// SHOW SEARCHED USER ON OTHER PAGE
router.post('/searchUser', require('connect-ensure-login').ensureLoggedIn(),
	homeController.searchUserGet);
// INSERT NEW TWEET
router.post('/insertfeed', require('connect-ensure-login').ensureLoggedIn(),
	feedController.insertPost);
// EDIT TWEET
router.post('/edittweet', require('connect-ensure-login').ensureLoggedIn(),
	feedController.edittweetPost);
// GET USER'S FOLLOWINGS
router.post('/getfollowing', require('connect-ensure-login').ensureLoggedIn(),
	homeController.getfollowingPost);
// GET USER'S FOLLOWERS
router.post('/getfollowers', require('connect-ensure-login').ensureLoggedIn(),
	homeController.getfollowersPost);
// GET USER'S TWEET
router.post('/getTweet', require('connect-ensure-login').ensureLoggedIn(),
	homeController.getTweetPost);
// TWEET LIKE-UNLIKE FEATURES
router.post('/like', require('connect-ensure-login').ensureLoggedIn(),
	homeController.likePost);
// GET OTHER USER'S FOLLOWERS
router.post('/getFriendFollowers', require('connect-ensure-login').ensureLoggedIn(),
	feedController.friendFollowersPost);
// GET OTHER USER'S FOLLOWINGS
router.post('/getFriendFollowing', require('connect-ensure-login').ensureLoggedIn(),
	feedController.friendFollowingPost);
// GET OTHER USER'S TWEETS
router.post('/getFriendTweet', feedController.friendTweetsPost);

module.exports = router;
