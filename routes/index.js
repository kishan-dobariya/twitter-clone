const express = require('express');
let session =require('express-session');
const path = require('path');
var multer  = require('multer');

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

const userController = require('../controllers/user.controller.js');
const homeController = require('../controllers/home.controller.js');

router.get('/login', userController.checkSession, userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/logout', userController.logoutGet);
router.get('/registration', userController.registrationGet);
router.post('/registration', userController.registrationPost);
router.get('/resetpassword', userController.resetpasswordGet);
router.post('/resetpassword', userController.resetpasswordPost);
router.post('/setpassword', userController.setpasswordPost);
router.get('/home', homeController.homePageGet);
router.get('/showprofile', homeController.showprofileGet);
router.get('/editprofile', homeController.editprofileGet);
router.post('/editprofile', upload.single('profilepicture'), homeController.editprofilePost);
router.post('/follow', homeController.addFollowerGet);
router.get('/search', homeController.searchGet);
//router.get('/friendprofile', homeController.friendprofileGet);

module.exports = router;
