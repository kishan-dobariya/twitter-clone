const mongoose = require('mongoose');
var followerSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	following: {
		type: String,
		required: true
	},
	status: {
		type: Boolean,
		required: true
	},
	createdAt: {
		type: Date,
		default: function () {
			return new Date();
		}
	}
});

var Follower = module.exports = mongoose.model('follower', followerSchema);
module.exports.createFollower = function (newFollwer, callback) {
	newFollwer.save(callback);
};

module.exports.getFollower = function (newFollwer, callback) {
	 return new Promise((resolve, reject) => {
		Follower.findOne(newFollwer, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.searchUser = function (user, callback) {
	return new Promise((resolve, reject) => {
		Follower.find(user, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.getFollowers = function (user, callback) {
	return new Promise((resolve, reject) => {
		Follower.count(user, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.updateStatus = function (query, newstatus) {
	return new Promise((resolve, reject) => {
		Follower.update(query, { $set: {status: newstatus}}, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};
