let commonFunction = require('../controllers/common.controller');

const mongoose = require('mongoose');
let bcrypt = require('bcrypt');
var UserSchema = mongoose.Schema({
	name: {
		type: String,
		default: ''
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	Status: {
		type: Boolean,
		default: false,
		required: true
	},
	createdAt: {
		type: Date,
		default: function () {
			return new Date();
		}
	},
	deletedAt: {
		type: Date,
		default: ''
	},
	updatedAt: {
		type: Date,
		default: function () {
			return new Date();
		}
	},
	updatedBy: {
		type: String,
		ref: 'User'
	},
	bio: {
		type: String
	},
	location: {
		type: String
	},
	website: {
		type: String
	},
	birthdate: {
		type: Date
	},
	imageURL: {
		type: String,
		default: 'public' + '\\' + 'images' + '\\' + 'defaultProfile.png'
	},
	coverImage: {
		type: String,
		default: 'images' + '\\' + 'default.png'
	}
});

var User = module.exports = mongoose.model('users', UserSchema);
module.exports.createUser = function (newUser, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newUser.password, salt, function (err, hash) {
			if (err) {
				console.log('err');
			}
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

module.exports.getUser = function (query) {
	return new Promise((resolve, reject) => {
		User.findOne({username: query.username}, function (err, data) {
			if (err) {
				console.log('err', err);
				reject('Invalid Username');
			}
			if (data != null) {
				bcrypt.compare(query.password, data.password, function (err2, result) {
					if (err2) {
						reject(err2);
					}
					if (result) {
						if (!data.Status) {
							resolve('Not verified');
						} else {
							resolve(data);
						}
					} else {
						resolve('Invalid password');
					}
				});
			} else {
				resolve('Invalid username');
			}
		});
	});
};

module.exports.getUserHome = function (query) {
	return new Promise((resolve, reject) => {
		User.findOne(query, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.findById = function (id) {
	return new Promise((resolve, reject) => {
		User.findOne({ _id: id }, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.updatePassword = function (query, newPassword) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newPassword, salt, function (err, hash) {
			if (err) {
				console.log('err');
			}
			newPassword = hash;
			return new Promise((resolve, reject) => {
				User.update(query, { $set: {password: newPassword}}, function (err, data) {
					if (err) {
						reject(err);
					}
					resolve(data);
				});
			});
		});
	});
};

module.exports.updateUser = function (query, updated) {
	return new Promise((resolve, reject) => {
		User.update(query, updated, function (err, data) {
			if (err) {
				reject(err);
			}
			console.log(data);
			resolve(data);
		});
	});
};

module.exports.updateProfile = function (query, name, bio, mail, location, dob, path) {
	return new Promise((resolve, reject) => {
		if (path !== 'not difined') {
			User.update(query, { $set: {name: name,
				bio: bio,
				email: mail,
				location: location,
				birthdate: dob,
				imageURL: commonFunction.editpath(path)}}, function (err, data) {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		} else {
			User.update(query, { $set: {name: name,
				bio: bio,
				email: mail,
				location: location,
				birthdate: dob}}, function (err, data) {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		}
	});
};

module.exports.updateStatus = function (query, status) {
	return new Promise((resolve, reject) => {
		User.update(query, { $set: {verificationStatus: status}}, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.updateCoverImage = function (query, newPath) {
	return new Promise((resolve, reject) => {
		User.update(query, { $set: {coverImage: commonFunction.editpath(newPath)}}, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.searchUser = function (user, callback) {
	return new Promise((resolve, reject) => {
		User.find(user, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};
