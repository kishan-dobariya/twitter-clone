// let tempEmail;
let User = require('../models/users.models');
let Hash = require('../models/hash.models');
let bcrypt = require('bcrypt');
let jwt = require('Jsonwebtoken');
let cookie = require('cookie');
let session = require('express-session');
let nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

let transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	port: 25,
	auth: {
		user: 'kishandobariya033@gmail.com',
		pass: 'Kishan.@&033'
	},
	tls: {
		rejectUnauthorized: false
	}
});

// ---------------------WHEN REDIRECT TO LOGIN PAGE---------------------------//
exports.loginGet = function (req, res) {
	res.render('login');
};

// ----------------CHECK USERNAME AND PASSWORD FOR LOGIN----------------------//
exports.loginPost = async function (req, res) {
	console.log('loginPost');
	let uname = req.body.username;
	let upassword = req.body.password;
	let session_obj = req.session;
	let flag = false;
	let user = await User.getUserHome({ username: uname, Status: true});
	if (user == null) {
		res.redirect('/login');
	}
	bcrypt.compare(upassword, user.password).then(function (result) {
		if (result) {
			res.redirect('/home');
		} else {
			console.log('Invalid un or pw');
			req.flash('loginFailed', 'Invalid Username or Password');
			res.render('login', { messages: req.flash('loginFailed') });
		}
	});
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
	let user = await User.getUserHome({ username: uusername});
	if (user) {
		userexistance = true;
	}
	user = await User.getUserHome({ email: uemail});
	if (user) {
		userexistance = true;
	}
	if (!userexistance) {
		let newUser = new User({name: uname,
			username: uusername,
			email: uemail,
			password: upassword
		});
		await User.createUser(newUser, async function (err, userInfo) {
			if (err) {
				throw err;
			}
			let crypted = await createCipherText({username: userInfo.username,
				email:	userInfo.email,
				createdAt:	userInfo.createdAt});
			let userCipher = new Hash({ username: userInfo.username, cipher: crypted });
			Hash.createCipher(userCipher, function (err, cipherInfo) {
				if (err) {
					console.log('err--->', err);
				}
			});
			let helperoption = {
				from: '"Kishan" <kishandobariya033@gmail.com',
				to: 'kishan.dobariya@bacancytechnology.com',
				subject: 'Demo Mail',
				text: 'click this link to verify your account--->' +
							'http://localhost:8080/verifyaccount?user=' + crypted
			};
			transporter.sendMail(helperoption, function (err, data) {
				if (err) {
					console.log(err);
				} else {
					// console.log(data);
				}
			});
			res.render('login', {
				registrationSuccessful: 'Check your mail for verification.'
			});
		});
	} else {
		res.render('registration', {
			alreadyExist: 'Usernaem already exist. Please select different Username.'
		});
	}
};

function createCipherText (user) {
	let plainText = JSON.stringify(user);
	let cipher = crypto.createCipher('aes-256-ctr', process.env.SECRET_KEY);
	let crypted = cipher.update(plainText, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

exports.verifyaccountGet = async function (req, res) {
	let userCipher = await Hash.getCipher({cipher: req.query.user});
	if (userCipher != null) {
		if (userCipher.Status != false) {
			await Hash.updateStatus({cipher: req.query.user}, { $set: {Status: false}});
			await User.updateUser({ username: userCipher[0].username }, { $set: {Status: true}});
		}
	}
	res.redirect('/login');
};

// -------------------WHEN REDIRECT TO RESETPASSWORD PAGE----------------------//
exports.getMailGet = function (req, res) {
	res.render('getmail');
};

// ----------------------CHECKING EMAIL FOR RESETPASSWORD----------------------//
exports.getMailPost = async function (req, res) {
	let uemail = req.body.email;
	let user = await User.getUserHome({email: uemail});
	if (user) {
		let createdAt = new Date();
		console.log("Date------------>",createdAt);
		let crypted = await createCipherText({username: user.username,
			email:	user.email,
			createdAt:	createdAt});
		let userCipher = new Hash({ username: user.username, cipher: crypted });
		Hash.createCipher(userCipher, function (err, cipherInfo) {
			if (err) {
				console.log('err--->', err);
			}
		});
		let helperoption = {
		from: '"Kishan" <kishandobariya033@gmail.com',
		to: 'kishan.dobariya@bacancytechnology.com',
		subject: 'Demo Mail',
		text: 'Click here to reset your Password--->' +
					'http://localhost:8080/resetpassword?user=' + crypted
		};
		transporter.sendMail(helperoption, function (err, data) {
			if (err) {
				console.log(err);
			} else {
				// console.log(data);
			}
		});
		req.flash('alertClass', 'alert-success');
		req.flash('messages', 'Check your Email to reset your Password');
		res.render('login', { messages: req.flash('messages'), alertClass: req.flash('alertClass') });
	} else {
		console.log('email not found');
		req.flash('alertClass', 'alert-danger');
		req.flash('messages', 'Email Not Found');
		res.render('getmail', { messages: req.flash('messages'), alertClass: req.flash('alertClass') });
	}
};

exports.resetpasswordGet = async function (req, res) {
	let userCipher = await Hash.getCipher({cipher: req.query.user, Status:true});
	if (userCipher.length != 0) {
		if (userCipher.Status != false) {
			await Hash.updateStatus({cipher: req.query.user}, { $set: {Status: false}});
			res.render('setpassword',{ hash : req.query.user});
		}
	}
	req.flash('alertClass', 'alert-danger');
	req.flash('messages', 'Passwordreset link expire, Please try again');
	res.render('login', { messages: req.flash('messages'), alertClass: req.flash('alertClass') });
};

// ----------------------------UPDATE NEW PASSWORD----------------------------//
exports.resetpasswordPost = async function (req, res) {
	let upassword = req.body.password;
	let userCipher = await Hash.getCipher({cipher: req.body.hash});
	let passWord = await User.updatePassword({username: userCipher[0].username}, upassword);
		 res.redirect('/login');
};
