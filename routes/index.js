const express = require('express');
const router = express.Router();

const requestController = require('../controllers/test.controller.js');

router.get('/login', requestController.loginGet);
router.post('/login', requestController.loginPost);
router.get('/registration', requestController.registrationGet);
router.post('/registration', requestController.registrationPost);

module.exports = router;

