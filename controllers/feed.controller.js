let User = require('../models/users.models');
let Follower = require('../models/followers.models');
let Feed = require('../models/tweet.models');
let commonFunction = require('./common.controller');

// -----------------------INSERT TWEET--------------------------//
exports.insertPost = async function (req, res, next) {
	if (req.body.tweet !== '' || req.file !== undefined) {
		let newTweet;
		if (req.file == undefined && req.body.tweet !== '') {
			newTweet = new Feed({ username: req.user.username,
				tweet: req.body.tweet,
				status: 'new' });
		} else if (req.file !== undefined && req.body.tweet == '') {
			newTweet = new Feed({ username: req.user.username,
				status: 'new',
				imageURL: commonFunction.editpath(req.file.path)
			});
		} else {
			newTweet = new Feed({ username: req.user.username,
				tweet: req.body.tweet,
				status: 'new',
				imageURL: commonFunction.editpath(req.file.path)
			});
		}
		await Feed.createTweet(newTweet, function (err, tweetInfo) {
			if (err) {
				throw err;
			} else {
				res.redirect('/home');
			}
		});
	} else {
		res.redirect('/home');
	}
};

// ------------------------EDIT TWEET----------------------------//
exports.edittweetPost = async function (req, res, next) {
	await Feed.updateTweet({ _id: req.body.tweetId}, req.body.newTweet)
		.then(function (argument) {
			res.send(true);
		}).catch(function (argument) {
			res.send(false);
		});
};

// ------------------GET FRIEND'S FOLLOWERS-------------------------//
exports.friendFollowersPost = async function (req, res) {
	let searchresult = await Follower.searchUser({ following: req.body.userName, status: true});
	for (let i = 0; i < searchresult.length; i++) {
		let user = await User.getUserHome({ username: searchresult[i].username});
		if (user.imageURL != undefined) {
			let a = JSON.parse(JSON.stringify(searchresult[i]));
			a['imageURL'] = commonFunction.editpath(user.imageURL);
			a['name'] = user.name;
			a['bio'] = user.bio;
			searchresult[i] = a;
		} else {
			let a = JSON.parse(JSON.stringify(searchresult[i]));
			a['imageURL'] = 'images/twittericon.png';
			a['name'] = user.name;
			a['bio'] = user.bio;
			searchresult[i] = a;
		}
	}
	console.log('searchresult-------', searchresult);
	res.send(searchresult);
};

// ---------------------GET FRIEND'S FOLLOWING--------------------------//
exports.friendFollowingPost = async function (req, res) {
	let searchresult = await Follower.searchUser({ username: req.body.userName, status: true});
	for (let i = 0; i < searchresult.length; i++) {
		let user = await User.getUserHome({ username: searchresult[i].following});
		if (user.imageURL != undefined) {
			let a = JSON.parse(JSON.stringify(searchresult[i]));
			a['imageURL'] = commonFunction.editpath(user.imageURL);
			a['name'] = user.name;
			a['bio'] = user.bio;
			searchresult[i] = a;
		} else {
			let a = JSON.parse(JSON.stringify(searchresult[i]));
			a['imageURL'] = 'images/twittericon.png';
			searchresult[i] = a;
		}
	}
	console.log('followers----------->', searchresult);
	res.send(searchresult);
};

// --------------------------GET FRIEND'S TWEET----------------------------//
exports.friendTweetsPost = async function (req, res) {
	let tweet = await Feed.getTweet({ username: req.body.userName});
	let user = await User.getUserHome({ username: req.body.userName});
	tweet.sort((a, b) => {
		if (a.createdAt > b.createdAt) {
			return -1;
		} else if (a.createdAt < b.createdAt) {
			return 1;
		} else {
			return 0;
		}
	});
	tweet.unshift(user.name);
	tweet.unshift(user.username);
	tweet.unshift(commonFunction.editpath(user.imageURL));
	res.send(tweet);
};

// --------------------------DELETE TWEET----------------------------//
exports.deleteTweetPost = async function (req, res) {
	await Feed.deleteTweet({ _id: req.body.tweetId })
		.then(function (argument) {
			res.send(true);
		}).catch(function (argument) {
			res.send(false);
		});
};
