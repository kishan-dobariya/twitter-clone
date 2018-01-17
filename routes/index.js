const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller.js');

router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/registration', userController.registrationGet);
router.post('/registration', userController.registrationPost);
router.get('/resetpassword', userController.resetpasswordGet);
router.post('/resetpassword', userController.resetpasswordPost);
router.post('/setpassword', userController.setpasswordPost);
module.exports = router;
const homeController = require('../controllers/home.controller.js');
router.get('/home', homeController.homePageGet);
