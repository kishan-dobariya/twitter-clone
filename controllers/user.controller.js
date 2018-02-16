// let tempEmail;
let User = require('../models/users.models');
let Cipher = require('../models/cipher.models');
let bcrypt = require('bcrypt');
let jwt = require('Jsonwebtoken');
let cookie = require('cookie');
let session = require('express-session');
let nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

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
			let token = jwt.sign({ email: user.email, name: user.name}, 'kkd');
			res.cookie('userToken', token);
			session_obj.sess = token;
			session_obj.username = user.username;
			res.redirect('/home');
		} else {
			console.log("Invalid un or pw");
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
			let crypted = await createCipherText({username : userInfo.username,
																	email :	userInfo.email,
																	createdAt :	userInfo.createdAt});
			let userCipher = new Cipher({ username : userInfo.username , cipher : crypted });
		  Cipher.createCipher(userCipher, function (err, cipherInfo) {
		  	if (err) {
		  		console.log("err--->",err);
		  	}
		  	// console.log(cipherInfo);
		  })
			let helperoption = {
				from : '"Kishan" <kishandobariya033@gmail.com',
				to : 'kishan.dobariya@bacancytechnology.com',
				subject: 'Demo Mail',
				text: 'click this link to verify your account--->'+
							'http://localhost:8080/verifyaccount?user='+crypted,
			};
			transporter.sendMail(helperoption, function (err, data) {
				if(err){
					console.log(err);
				}
				else{
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

function createCipherText(user) {
	let plainText = JSON.stringify(user);
	let cipher = crypto.createCipher('aes-256-ctr',process.env.SECRET_KEY)
  let crypted = cipher.update(plainText,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.verifyaccountGet = async function (req, res) {
	let userCipher = await Cipher.getCipher({cipher : req.query.user});
	if(userCipher != null) {
		if(userCipher.Status != false) {
			await Cipher.updateStatus({cipher: req.query.user},{ $set: {Status : false}});
			await User.updateUser({ username : userCipher[0].username }, { $set : {Status :true}});
		}
	}
	res.redirect('/login');
};

// -------------------WHEN REDIRECT TO RESETPASSWORD PAGE----------------------//
exports.resetpasswordGet = function (req, res) {
	res.render('getmail');
};

// ----------------------CHECKING EMAIL FOR RESETPASSWORD----------------------//
exports.resetpasswordPost = async function (req, res) {
	let uemail = req.body.email;
	let user = await User.getUserHome({email: uemail});
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
