let tempEmail;
let User = require('../models/users.models');
let bcrypt = require('bcrypt');
let jwt = require('Jsonwebtoken');
let cookie = require('cookie');
let session = require('express-session');
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
	service : 'gmail',
	secure: false,
	port: 25,
	auth: {
		user: 'kishandobariya033@gmail.com',
		pass: 'Kishan.@&033'
	},
	tls:{
		rejectUnauthorized : false
	}
});
let helperoption = {
	from : '"Kishan" <kishandobariya033@gmail.com',
	to : 'mihir.kanzariya@bacancytechnology.com',
	subject: 'Demo Mail',
	text: 'Hello form KKD',
};

// ---------------------WHEN REDIRECT TO LOGIN PAGE---------------------------//
exports.loginGet = function (req, res) {
	transporter.sendMail(helperoption, function (err, data) {
		if(err){
			console.log(err);
		}
		else{
			console.log(data);
		}
	})
	res.render('login');
};

// ----------------CHECK USERNAME AND PASSWORD FOR LOGIN----------------------//
exports.loginPost = async function (req, res) {
	console.log('loginPost');
	let uname = req.body.username;
	let upassword = req.body.password;
	let session_obj = req.session;
	let flag = false;
	let user = await User.getUser({ username: uname});
	bcrypt.compare(upassword, user.password).then(function (result) {
		if (result) {
			let token = jwt.sign({ email: user.email, name: user.name}, 'kkd');
			res.cookie('userToken', token);
			session_obj.sess = token;
			session_obj.username = user.username;
			res.redirect('/home');
		} else {
			res.render('login');
		}
	});
};

// -------------------------------LOGOUT------------------------------------//
exports.logoutGet = function (req, res) {
	req.session.destroy();
	res.redirect('login');
};

// -------------------WHEN REDIRECT TO REGISTRATION PAGE----------------------//
exports.registrationGet = function (req, res) {
	res.render('registration');

};

// --------------------------REGISTRATION REQUEST------------------------------//
exports.registrationPost = async function (req, res) {
	let uname = req.body.name;
	let uusername = req.body.username;
	let upassword = req.body.password;
	let uemail = req.body.email;
	let userexistance = false;
	let encryptPassword, randomSalt;
	let user = await User.getUser({ username: uusername});
	if (user) {
		userexistance = true;
	}
	user = await User.getUser({ email: uemail});
	if (user) {
		userexistance = true;
	}
	if (!userexistance) {
		let newUser = new User({name: uname,
			username: uusername,
			email: uemail,
			password: upassword});
		await User.createUser(newUser, function (err, userInfo) {
			if (err) {
				throw err;
			}
			res.render('login', {
				registrationSuccessful: 'Registration Successfull. Login here.'
			});
		});
	} else {
		res.render('registration', {
			alreadyExist: 'Usernaem already exist. Please select different Username.'
		});
	}
};

// -------------------WHEN REDIRECT TO RESETPASSWORD PAGE----------------------//
exports.resetpasswordGet = function (req, res) {
	res.render('getmail');
};

// ----------------------CHECKING EMAIL FOR RESETPASSWORD----------------------//
exports.resetpasswordPost = async function (req, res) {
	let uemail = req.body.email;
	let user = await User.getUser({email: uemail});
	if (user) {
		tempEmail = uemail;
		res.render('setpassword');
	} else {
		res.render('getmail');
	}
};

// ----------------------------UPDATE NEW PASSWORD----------------------------//
exports.setpasswordPost = async function (req, res) {
	let upassword = req.body.password;
	 let passWord = await User.updatePassword({email: tempEmail}, upassword).then(console.log);
		 res.redirect('/login');
};

//
// exports.homePageGet = function (req, res) {
// 	res.render('index', {
// 		title: 'name'
// 	});
// };
