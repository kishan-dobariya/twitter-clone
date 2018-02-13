let User = require('../models/users.models');
let Follower = require('../models/followers.models');
let Feed = require('../models/userfeed.models');

function editpath (url) {
	if (url !== null && url !== undefined) {
		return url.replace('public\\', '');
	}
}

// -----------------------INSERT TWEET--------------------------//
exports.insertPost = async function (req, res, next) {
	if (req.body.tweet !== '') {
		let newTweet = new Feed({ username: req.session.username,
			tweet: req.body.tweet,
			status: 'new' });
		await Feed.createTweet(newTweet, function (err, tweetInfo) {
			if (err) {
				throw err;
			}
		});
		res.send();
	}
};

// ------------------------EDIT TWEET----------------------------//
exports.edittweetPost = async function (req, res, next) {
	console.log('body', req.body);
	await Feed.updateTweet({ _id: req.body.tweetId}, req.body.newTweet)
		.then(function (argument) {
			console.log(argument);
			res.send(true);
		}).catch(function (argument) {
			console.log(argument);
		});
	res.send(null);
};

// ------------------GET FRIEND'S FOLLOWERS-------------------------//
exports.friendFollowersPost = async function (req, res) {
	let searchresult = await Follower.searchUser({ following: req.body.userName, status: true});
	for (let i = 0; i < searchresult.length; i++) {
		let user = await User.getUser({ username: searchresult[i].username});
		if (user.imageURL != undefined) {
			let a = JSON.parse(JSON.stringify(searchresult[i]));
			a['imageURL'] = editpath(user.imageURL);
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
	console.log(req.body.userName);
	let searchresult = await Follower.searchUser({ username: req.body.userName, status: true});
	for (let i = 0; i < searchresult.length; i++) {
		let user = await User.getUser({ username: searchresult[i].following});
		if (user.imageURL != undefined) {
			let a = JSON.parse(JSON.stringify(searchresult[i]));
			a['imageURL'] = editpath(user.imageURL);
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
	console.log(req.body.userName);
	let tweet = await Feed.getTweet({ username: req.body.userName});
	let user = await User.getUser({ username: req.body.userName});
	tweet.sort((a, b) => {
		if (a.createdAt > b.createdAt) { return -1; } else if (a.createdAt < b.createdAt) { return 1; } else { return 0; }
	});
	tweet.unshift(user.name);
	tweet.unshift(user.username);
	tweet.unshift(editpath(user.imageURL));
	res.send(tweet);
};
