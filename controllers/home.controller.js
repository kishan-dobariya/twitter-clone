let session = require('express-session');
let latestTweets = require('latest-tweets');

let User = require('../models/users.models');
let Follower = require('../models/followers.models');
let Feed = require('../models/userfeed.models');

// -------------------------GET TWEET FOR HOMEPAGE-----------------------------//
async function getTweet (req, res, followerslist) {
	if ((followerslist.length != 0)) {
		return new Promise(async (resolve, reject) => {
			let tweetArray = [];
			let k = 0;
			for (let i = 0; i < followerslist.length; i++) {
				let tweet = await Feed.getTweet({ username: followerslist[i].following});
				if (tweet.length != 0) {
					let user = await User.getUserHome({ username: followerslist[i].following});
					for (let l = 0; l < tweet.length; l++) {
						if (tweet[l].like.includes(req.user.username)) {
							tweet[l].likestatus = 'Unlike';
						} else {
							tweet[l].likestatus = 'Like';
						}
						tweet[l].likeCount = 	tweet[l].like.length;
						tweet[l].name = user.name;
						tweet[l].path = editpath(user.imageURL);
						tweetArray[k] = tweet[l];
						k++;
					}
				}
				if (i === followerslist.length - 1) {
					let tweet = await Feed.getTweet({ username: req.user.username});
					if (tweet.length != 0) {
						let user = await User.getUserHome({ username: req.user.username});
						for (let l = 0; l < tweet.length; l++) {
							if (tweet[l].like.includes(req.user.username)) {
								tweet[l].likestatus = 'Unlike';
							} else {
								tweet[l].likestatus = 'Like';
							}
							tweet[l].likeCount = 	tweet[l].like.length;
							// console.log("like",tweet[l].likeCount)
							tweet[l].name = user.name;
							tweet[l].path = editpath(user.imageURL);
							tweetArray[k] = tweet[l];
							k++;
						}
					}
					resolve(tweetArray.sort((a, b) => {
						if (a.createdAt > b.createdAt) { return -1; } else if (a.createdAt < b.createdAt) { return 1; } else { return 0; }
					}));
				}
			}
		});
	} else {
		return new Promise(async (resolve, reject) => {
			resolve(null);
		});
	}
}

// -------------------------------HOMEPAGE------------------------------------//
exports.homePageGet = async function (req, res) {
	let user = await User.getUserHome({ username: req.user.username});
	let followercount = await Follower.getFollowers({ following: req.user.username, status: true});
	let followingcount = await Follower.getFollowers({ username: req.user.username, status: true});
	let followerslist = await Follower.searchUser({ username: req.user.username, status: true});
	let tweetcount = await Feed.getTweetCount({ username: req.user.username});
	let birthdate = formatDate(user.birthdate);
	let editedpath = editpath(user.imageURL);

	let tweetArray = await getTweet(req, res, followerslist);
	res.render('home', {
		username: user.username,
		name: user.name,
		bio: user.bio,
		email: user.email,
		location: user.location,
		birthdate: birthdate,
		imgpath: editedpath,
		followers: followercount,
		folowings: followingcount,
		tweets: tweetArray,
		tweetcount: tweetcount
	});
};

exports.showFriendProfileGet = async function (req, res) {
	let user = await User.getUserHome({ username: req.query.un});
	let friendfollowercount = await Follower.getFollowers({ following: req.query.un, status: true});
	let friendfollowingcount = await Follower.getFollowers({ username: req.query.un, status: true});
	let friendtweetcount = await Feed.getTweetCount({ username: req.query.un});
	let status = await Follower.getFollower({username: req.user.username, following: req.query.un});
	if (status === null) {
		status = 'Follow';
	} else {
		if (status.status == true) {
			status = 'Unfollow';
		} else {
			status = 'Follow';
		}
	}
	let a = JSON.parse(JSON.stringify(user));
	a['followingcount'] = friendfollowingcount;
	a['followercount'] = friendfollowercount;
	a['tweetcount'] = friendtweetcount;
	a['status'] = status;
	user = a;
	let birthdate = formatDate(user.birthdate);
	let editedpath = editpath(user.imageURL);
	res.render('friendprofile', {
		user: user,
		birthdate: birthdate,
		imgpath: editedpath
	});
};

// --------------------------EDIT PATH FUNCTION FOR IMAGE----------------------//
function editpath (url) {
	// body...
	if (url !== null && url !== undefined) { return url.replace('public\\', ''); }
}

// ----------------------------USER PROFILE-----------------------------------//
exports.showprofileGet = async function (req, res) {
	let user = await User.getUserHome({ username: req.user.username});
	let followercount = await Follower.getFollowers({ following: req.user.username, status: true});
	let followingcount = await Follower.getFollowers({ username: req.user.username, status: true});
	let tweetcount = await Feed.getTweetCount({ username: req.user.username});
	let birthdate = formatDate(user.birthdate);
	user.imgpath = editpath(user.imageURL);
	user.followingcount = followingcount;
	user.followercount = followercount;
	user.tweetcount = tweetcount;
	res.render('showprofile', {
		user: user,
		name: user.name,
		bio: user.bio,
		email: user.email,
		location: user.location,
		 birthdate: birthdate
	});
};

// -------------------------------EDIT PROFILE -------------------------------//
exports.editprofileGet = async function (req, res) {
	let user = await User.getUserHome({ username: req.user.username});
	let birthdate = formatDate(user.birthdate);
	let path = '/images/profilepics/' + req.user.username + '.jpg';
	res.render('editprofile', {
		name: user.name,
		bio: user.bio,
		email: user.email,
		location: user.location,
		birthdate: birthdate,
		imgpath: path
	});
};

// --------------------------EDIT PROFILE POST-------------------------------//
exports.editprofilePost = async function (req, res) {
	if (req.file !== undefined) {
		User.updateProfile({username: req.user.username}, req.body.name, req.body.bio,
			req.body.email, req.body.location, req.body.dob,
			req.file.path).then(console.log);
		res.redirect('/showprofile');
	} else {
		User.updateProfile({username: req.user.username}, req.body.name, req.body.bio,
			req.body.email, req.body.location, req.body.dob,
			'not difined').then(console.log);
		res.redirect('/showprofile');
	}
};

// ------------------------FORMAT DATE(DD/MM/YYYY)----------------------------//
function formatDate (date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [day, month, year].join('-');
}

// -------------------------ADD AND UPDATE FOLLOWERS--------------------------//
exports.addFollowerGet = async function (req, res) {
	let alreadyFollower = await Follower.getFollower({username: req.user.username,
		following: req.body.un});
	if (alreadyFollower == null) {
		let newUser = Follower({
			username: req.user.username,
			following: req.body.un,
			status: req.body.status
		});
		await Follower.createFollower(newUser, function (err, userInfo) {
			if (err) {
				throw err;
			} else {
				res.send('Unfollow');
			}
		});
	} else {
		await Follower.updateStatus({ username: req.user.username, following: req.body.un
		}, req.body.status).then(function (data) {
			if (req.body.status !== 'false') {
				res.send('Unfollow');
			} else {
				res.send('Follow');
			}
		});
	}
};

// ------------------------------SEARCH USER---------------------------------//
exports.searchGet = async function (req, res) {
	if (req.query.keyword != '') {
		let searchresult = await User.searchUser({ username: {$regex: '.*' + req.query.keyword + '.*'}});
		let returnValue = '';
		searchresult.forEach(function (object) {
			if (object.username != req.user.username) {
				returnValue = returnValue + "<li class='list-group-item'><a href='/showFriendProfile?un=" +
																		object.username + "'>" + object.username + '</a></li>';
			}
		});
		res.send(returnValue);
	} else {
		res.send('');
	}
};

// ------------------------SEARCH USER ON NEW PAGE-----------------------------//
exports.searchUserGet = async function (req, res) {
	console.log('keyword', req.body.keyword);
	if (req.body.keyword != '') {
		let searchresult = await User.searchUser({ username: {$regex: '.*' + req.body.keyword + '.*'}});
		console.log('searchresult-->', searchresult);
		for (let i = 0; i < searchresult.length; i++) {
			let reverseFollowing = await Follower.getFollowers({username: req.user.username,
				following: searchresult.username,
				status: true});
			let a = JSON.parse(JSON.stringify(searchresult[i]));
			a['imageURL'] = editpath(searchresult[i].imageURL);
			if (reverseFollowing != 1) {
				a['reverseStatus'] = 'Follow';
			} else {
				a['reverseStatus'] = 'Unfollow';
			}
			searchresult[i] = a;
		}
		console.log('---------->', searchresult);
		res.render('searchuser_result', {
			searchResult: searchresult
		});
	} else {
		res.sendStatus(200);
	}
};

// ---------------------GET FORLLOWING FOR USER PROFILE PAGE------------------//
exports.getfollowingPost = async function (req, res) {
	let searchresult = await Follower.searchUser({ username: req.user.username, status: true});
	for (let i = 0; i < searchresult.length; i++) {
		let user = await User.getUserHome({ username: searchresult[i].following});
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
	res.send(searchresult);
};

// ---------------------GET FORLLOWERS FOR USER PROFILE PAGE------------------//
exports.getfollowersPost = async function (req, res) {
	let searchresult = await Follower.searchUser({ following: req.user.username, status: true});
	for (let i = 0; i < searchresult.length; i++) {
		let user = await User.getUserHome({ username: searchresult[i].username});
		let reverseFollowing = await Follower.getFollowers({username: req.user.username,
			following: user.username,
			status: true});
		if (user.imageURL != undefined) {
			let a = JSON.parse(JSON.stringify(searchresult[i]));
			a['imageURL'] = editpath(user.imageURL);
			a['name'] = user.name;
			a['bio'] = user.bio;
			if (reverseFollowing != 1) {
				a['reverseStatus'] = 'Follow';
			} else {
				a['reverseStatus'] = 'Unfollow';
			}
			searchresult[i] = a;
		} else {
			let a = JSON.parse(JSON.stringify(searchresult[i]));
			a['imageURL'] = 'images/twittericon.png';
			a['name'] = user.name;
			a['bio'] = user.bio;
			if (reverseFollowing != 1) {
				a['reverseStatus'] = 'Follow';
			} else {
				a['reverseStatus'] = 'Unfollow';
			}
			searchresult[i] = a;
		}
	}
	res.send(searchresult);
};

// ------------------------GET TWEETS FOR USER PROFILE PAGE------------------//
exports.getTweetPost = async function (req, res) {
	let tweet = await Feed.getTweet({ username: req.user.username});
	let user = await User.getUserHome({ username: req.user.username});
	tweet.sort((a, b) => {
		if (a.createdAt > b.createdAt) { return -1; } else if (a.createdAt < b.createdAt) { return 1; } else { return 0; }
	});
	tweet.unshift(user.name);
	tweet.unshift(user.username);
	tweet.unshift(editpath(user.imageURL));
	res.send(tweet);
};

// ----------------------------LIKE AND UNLIKE TWEET---------------------------//
exports.likePost = async function (req, res) {
	console.log(req.body.likestatus);
	status = req.body.likestatus.trim();
	if (status == 'Like') {
		let tweet = await Feed.getTweet({ _id: req.body.id});
		let tweetlike = tweet[0].like;
		tweetlike.push(req.user.username);
		let likeCount = tweetlike.length;
		await Feed.updateLike({ _id: req.body.id}, tweetlike)
			.then(function (argument) {
				console.log(argument);
				if (argument.nModified == 1) {
					res.send({id: req.body.id, tweetcount: likeCount, status: 'Unlike'});
				}
			}).catch(function (argument) {
				console.log(argument);
			});
	} else if (status == 'Unlike') {
		let tweet = await Feed.getTweet({ _id: req.body.id});
		let tweetlike = tweet[0].like;
		const index = tweetlike.indexOf(req.body.id);
		tweetlike.splice(index, 1);
		let likeCount = tweetlike.length;
		await Feed.updateLike({ _id: req.body.id}, tweetlike)
			.then(function (argument) {
				console.log(argument);
				res.send({id: req.body.id, tweetcount: likeCount, status: 'Like'});
			}).catch(function (argument) {
				console.log(argument);
			});
	} else {
		console.log('else');
		res.send(null);
	}
};
