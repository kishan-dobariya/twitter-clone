let session = require('express-session');
let latestTweets = require('latest-tweets');

let User = require('../models/users.models');
let Follower = require('../models/followers.models');
let Feed = require('../models/tweet.models');
let commonFunction = require('./common.controller');

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
						let time = new Date();
						tweet[l].timeDifference = commonFunction.timeDifference(time, tweet[l].createdAt);
						tweet[l].likeCount = 	tweet[l].like.length;
						tweet[l].name = user.name;
						tweet[l].path = commonFunction.editpath(user.imageURL);
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
							let time = new Date();
							tweet[l].timeDifference = commonFunction.timeDifference(time, tweet[l].createdAt);
							tweet[l].likeCount = 	tweet[l].like.length;
							tweet[l].name = user.name;
							tweet[l].path = commonFunction.editpath(user.imageURL);
							tweetArray[k] = tweet[l];
							k++;
						}
					}
					resolve(tweetArray.sort((a, b) => {
						if (a.createdAt > b.createdAt) {
							return -1;
						} else if (a.createdAt < b.createdAt) {
							return 1;
						} else {
							return 0;
						}
					}));
				}
			}
		});
	} else {
		let tweetArray = [];
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
				tweet[l].path = commonFunction.editpath(user.imageURL);
				tweetArray[l] = tweet[l];
			}
		}
		return new Promise(async (resolve, reject) => {
			resolve(tweetArray.sort((a, b) => {
				if (a.createdAt > b.createdAt) {
					return -1;
				} else if (a.createdAt < b.createdAt) {
					return 1;
				} else {
					return 0;
				}
			}));
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
	let birthdate = commonFunction.formatDate(user.birthdate);
	let editedpath = commonFunction.editpath(user.imageURL);

	let tweetArray = await getTweet(req, res, followerslist);
	res.render('home', {
		username: user.username,
		name: user.name,
		bio: user.bio,
		email: user.email,
		coverImage: user.coverImage,
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
	if (req.query.un == req.user.username) {
		res.redirect('/showprofile');
	}
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
	let birthdate = commonFunction.formatDate(user.birthdate);
	let editedpath = commonFunction.editpath(user.imageURL);
	res.render('friendprofile', {
		user: user,
		birthdate: birthdate,
		imgpath: editedpath
	});
};

// ----------------------------USER PROFILE-----------------------------------//
exports.showprofileGet = async function (req, res) {
	let user = await User.getUserHome({ username: req.user.username});
	let followercount = await Follower.getFollowers({ following: req.user.username, status: true});
	let followingcount = await Follower.getFollowers({ username: req.user.username, status: true});
	let tweetcount = await Feed.getTweetCount({ username: req.user.username});
	let birthdate = commonFunction.formatDate(user.birthdate);
	user.imgpath = commonFunction.editpath(user.imageURL);
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
	let birthdate = commonFunction.formatDate(user.birthdate);
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
			req.file.path).then();
		res.redirect('/showprofile');
	} else {
		User.updateProfile({username: req.user.username}, req.body.name, req.body.bio,
			req.body.email, req.body.location, req.body.dob,
			'not difined').then();
		res.redirect('/showprofile');
	}
};

// --------------------------EDIT  PROFILE POST-------------------------------//
exports.updateCoverImage = async function (req, res) {
	if (req.file !== undefined) {
		User.updateCoverImage({username: req.user.username}, req.file.path).then();
		res.redirect('/showprofile');
	} else {
		res.redirect('/showprofile');
	}
};

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
		let searchresult = await User.searchUser({ username: {$regex: new RegExp('^' +
			                                        req.query.keyword.toLowerCase(), 'i')}});
		let returnValue = '';
		searchresult.forEach(function (object) {
			if (object.username != req.user.username) {
				returnValue = returnValue + "<li class='list-group-item'><a href='/showFriendProfile?un=" +
																		object.username + "'>" + object.username + '</a></li>';
			}
		});
		if (returnValue == '') {
			returnValue = '<li class=list-group-item>No Match Found</li>';
			res.send(returnValue);
		} else {
			res.send(returnValue);
		}
	} else {
		res.send('');
	}
};

// ------------------------SEARCH USER ON NEW PAGE-----------------------------//
exports.searchUserGet = async function (req, res) {
	if (req.body.keyword != '') {
		let searchresult = await User.searchUser({ username: {$regex: new RegExp('^' +
																													req.body.keyword.toLowerCase(), 'i')}});
		if (searchresult.length == 0) {
			req.flash('error', 'No user found');
			res.render('searchuser_result', {
				searchResult: searchresult
			});
		} else {
			let indexOfUser = searchresult.indexOf(req.user.username);
			if (indexOfUser >= 0) { searchresult.splice(indexOfUser, 1); }
			for (let i = 0; i < searchresult.length; i++) {
				let reverseFollowing = await Follower.getFollowers({username: req.user.username,
					following: searchresult[i].username,
					status: true});
				console.log('reverseFollowing---->', reverseFollowing);
				let a = JSON.parse(JSON.stringify(searchresult[i]));
				a['imageURL'] = commonFunction.editpath(searchresult[i].imageURL);
				if (reverseFollowing == 0) {
					a['reverseStatus'] = 'Follow';
				} else {
					a['reverseStatus'] = 'Unfollow';
				}
				searchresult[i] = a;
			}
			res.render('searchuser_result', {
				searchResult: searchresult
			});
		}
	} else {
		req.flash('error', 'No user found');
		res.render('searchuser_result');
	}
};

// ---------------------GET FORLLOWING FOR USER PROFILE PAGE------------------//
exports.getfollowingPost = async function (req, res) {
	let searchresult = await Follower.searchUser({ username: req.user.username, status: true});
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
			a['imageURL'] = commonFunction.editpath(user.imageURL);
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

// ----------------------------LIKE AND UNLIKE TWEET---------------------------//
exports.likePost = async function (req, res) {
	status = req.body.likestatus.trim();
	if (status == 'Like') {
		let tweet = await Feed.getTweet({ _id: req.body.id});
		let tweetlike = tweet[0].like;
		tweetlike.push(req.user.username);
		let likeCount = tweetlike.length;
		await Feed.updateLike({ _id: req.body.id}, tweetlike)
			.then(function (argument) {
				if (argument.nModified == 1) {
					req.io.emit('like', {likeCount: likeCount, tweetId: req.body.id});
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
				req.io.emit('like', {likeCount: likeCount, tweetId: req.body.id});
				res.send({id: req.body.id, tweetcount: likeCount, status: 'Like'});
			}).catch(function (argument) {
				console.log(argument);
			});
	} else {
		res.send(null);
	}
};
