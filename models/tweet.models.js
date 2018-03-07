const mongoose = require('mongoose');
var FeedSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	tweet: {
		type: String
	},
	status: {
		type: String,
		required: true
	},
	like: {
		type: [String]
	},
	imageURL: {
		type: String
	},
	createdAt: {
		type: Date,
		default: function () {
			return new Date();
		}
	},
	updatedAt: {
		type: Date
		// ref:'User'
	}
});

let Feed = module.exports = mongoose.model('feed', FeedSchema);

module.exports.createTweet = function (newFeed, callback) {
	newFeed.save(callback);
};

module.exports.getTweet = function (query, callback) {
	return new Promise((resolve, reject) => {
		Feed.find(query, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.getTweetCount = function (user, callback) {
	return new Promise((resolve, reject) => {
		Feed.count(user, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.updateLike = function (query, like) {
	return new Promise((resolve, reject) => {
		Feed.update(query, { $set: { like: like}}, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.updateTweet = function (query, tweet) {
	return new Promise((resolve, reject) => {
		Feed.update(query, { $set: { tweet: tweet}}, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

module.exports.deleteTweet = function (query, tweet) {
	return new Promise((resolve, reject) => {
		Feed.remove(query, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};
