const express = require('express');
const path = require('path');
var multer = require('multer');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const userController = require('../controllers/user.controller.js');
const homeController = require('../controllers/home.controller.js');
const feedController = require('../controllers/feed.controller.js');
let commonFunction = require('../controllers/common.controller');

const router = express.Router();
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		if (req.originalUrl == '/updateCoverImage') {
			callback(null, 'public/images/coverpics/');
		} else if (req.originalUrl == '/editprofile') {
			callback(null, 'public/images/profilepics/');
		} else if (req.originalUrl == '/insertfeed') {
			console.log("insertPost")
			callback(null, 'public/images/tweetImages/');
		} else {
			callback(true, null);
		}
	},
	filename: function (req, file, callback) {
		if (req.originalUrl == '/updateCoverImage') {
			callback(null, req.user.username + path.extname(file.originalname));
		} else if (req.originalUrl == '/editprofile') {
			callback(null, req.user.username + path.extname(file.originalname));
		} else if (req.originalUrl == '/insertfeed') {
			callback(null, commonFunction.randomName() + path.extname(file.originalname));
		} else {
			callback(null, null);
		}
	}
});

const upload = multer({
	storage: storage,
	limits: {fileSize: 10000000},
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	}
});

// CHECK FILE TYPE
function checkFileType (file, cb) {
	const fileTypes = /jpeg|jpg|png|gif/;
	const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = fileTypes.test(file.mimetype);
	if (extName && mimetype) {
		return cb(null, true);
	} else {
		cb('Error : Images Only.');
	}
}

router.get('/', (req, res) => { res.redirect('/login'); });

router.get('/login', userController.loginGet);

router.post('/login', passport.authenticate('local', { 	successRedirect: '/home',
	failureRedirect: '/login',
	failureFlash: true }));
// LOGOUT ACTION
router.get('/logout', (req, res) => { req.logout(); res.redirect('/login'); });
// REDIRECT TO REGISTRATION PAGE
router.get('/registration', userController.registrationGet);
// REGISTRATION POST REQUEST
router.post('/registration', userController.registrationPost);
// MAIL VERIFICATION REQUEST
router.get('/verifyaccount', userController.verifyaccountGet);
// RENDER GET MAIL PAGE
router.get('/getmail', userController.getMailGet);
// GET MAIL FROM USER, VERIFY IT AND SEND LINK TO USERMAIL
router.post('/getmail', userController.getMailPost);
// CHECK FOR HASH AND RENDER SETPASSWORDPAGE
router.get('/resetpassword', userController.resetpasswordGet);
// UPDATE NEW PASSWORD
router.post('/resetpassword', userController.resetpasswordPost);
// REDRECT TO HOME PAGE
router.get('/home', require('connect-ensure-login').ensureLoggedIn(),
	homeController.homePageGet);
// SHOW USER PROFILE
router.get('/showprofile', require('connect-ensure-login').ensureLoggedIn(),
	homeController.showprofileGet);
// SHOW OTHER USER'S PROFILE
router.get('/showFriendProfile', require('connect-ensure-login').ensureLoggedIn(),
	homeController.showFriendProfileGet);
// EDIT USER'S PROFILE
router.post('/editprofile', upload.single('profilepicture'),
	homeController.editprofilePost);
// EDIT USER'S COVERIMAGE
router.post('/updateCoverImage', upload.single('coverImage'),
	homeController.updateCoverImage);
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
	upload.single('imageTweet'), feedController.insertPost);
// EDIT TWEET
router.post('/edittweet', require('connect-ensure-login').ensureLoggedIn(),
	feedController.edittweetPost);
// DELETE TWEET
router.post('/deletetweet', require('connect-ensure-login').ensureLoggedIn(),
	feedController.deleteTweetPost);
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
