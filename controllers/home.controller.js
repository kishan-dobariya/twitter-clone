let session = require('express-session');
let latestTweets = require('latest-tweets');

let User = require('../models/users.models');
let Follower = require('../models/followers.models');
let Feed = require('../models/userfeed.models');

async function getTweet (req, res, followerslist) {
	if ((followerslist.length != 0)) {
		return new Promise(async (resolve, reject) => {
			let tweetArray = [];
			let k = 0;
			for (let i = 0; i < followerslist.length; i++) {
				let tweet = await Feed.getTweet({ username: followerslist[i].following});
				if (tweet.length != 0) {
					let user = await User.getUser({ username: followerslist[i].following});
					for (let l = 0; l < tweet.length; l++) {
						if (tweet[l].like.includes(req.session.username)) {
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
					let tweet = await Feed.getTweet({ username: req.session.username});
					if (tweet.length != 0) {
						let user = await User.getUser({ username: req.session.username});
						for (let l = 0; l < tweet.length; l++) {
							if (tweet[l].like.includes(req.session.username)) {
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

exports.homePageGet = async function (req, res) {
	if (req.query.un == undefined) {
		let user = await User.getUser({ username: req.session.username});
		let followercount = await Follower.getFollowers({ following: req.session.username, status: true});
		let followingcount = await Follower.getFollowers({ username: req.session.username, status: true});
		let followerslist = await Follower.searchUser({ username: req.session.username, status: true});
		let tweetcount = await Feed.getTweetCount({ username: req.session.username});
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
	} else {
		let user = await User.getUser({ username: req.query.un});
		let friendfollowercount = await Follower.getFollowers({ following: req.query.un, status: true});
		let friendfollowingcount = await Follower.getFollowers({ username: req.query.un, status: true});
		let friendtweetcount = await Feed.getTweetCount({ username: req.query.un});
		let status = await Follower.getFollower({username: req.session.username, following: req.query.un});
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
	}
};

function editpath (url) {
	// body...
	if (url !== null && url !== undefined) { return url.replace('public\\', ''); }
}

exports.showprofileGet = async function (req, res) {
	let user = await User.getUser({ username: req.session.username});
	let followercount = await Follower.getFollowers({ following: req.session.username, status: true});
	let followingcount = await Follower.getFollowers({ username: req.session.username, status: true});
	let tweetcount = await Feed.getTweetCount({ username: req.session.username});
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

exports.editprofileGet = async function (req, res) {
	let user = await User.getUser({ username: req.session.username});
	let birthdate = formatDate(user.birthdate);
	let path = '/images/profilepics/' + req.session.username + '.jpg';
	res.render('editprofile', {
		name: user.name,
		bio: user.bio,
		email: user.email,
		location: user.location,
		birthdate: birthdate,
		imgpath: path
	});
};

function formatDate (date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [day, month, year].join('/');
}

exports.editprofilePost = async function (req, res) {
	if (req.file !== undefined) {
		User.updateProfile({username: req.session.username}, req.body.name, req.body.bio,
			req.body.email, req.body.location, req.body.dob,
			req.file.path).then(console.log);
		res.redirect('/showprofile');
	} else {
		User.updateProfile({username: req.session.username}, req.body.name, req.body.bio,
			req.body.email, req.body.location, req.body.dob,
			'not difined').then(console.log);
		res.redirect('/showprofile');
	}
};

exports.addFollowerGet = async function (req, res) {
	let alreadyFollower = await Follower.getFollower({username: req.session.username,
		following: req.body.un});
	if (alreadyFollower == null) {
		let newUser = Follower({
			username: req.session.username,
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
		await Follower.updateStatus({ username: req.session.username, following: req.body.un
		}, req.body.status).then(function (data) {
			if (req.body.status !== 'false') {
				res.send('Unfollow');
			} else {
				res.send('Follow');
			}
		});
	}
};

exports.searchGet = async function (req, res) {
	if (req.query.keyword != '') {
		let searchresult = await User.searchUser({ username: {$regex: '.*' + req.query.keyword + '.*'}});
		let returnValue = '';
		searchresult.forEach(function (object) {
			returnValue = returnValue + "<li class='list-group-item'><a href='/home?un=" +
																		object.username + "'>" + object.username + '</a></li>';
		});
		res.send(returnValue);
	} else {
		res.send('');
	}
};

exports.getfollowingPost = async function (req, res) {
	let searchresult = await Follower.searchUser({ username: req.session.username, status: true});
	console.log('searchresult--->', searchresult);
	for (let i = 0; i < searchresult.length; i++) {
		console.log('name', searchresult[i].following);
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
	res.send(searchresult);
};

exports.getfollowersPost = async function (req, res) {
	let searchresult = await Follower.searchUser({ following: req.session.username, status: true});
	for (let i = 0; i < searchresult.length; i++) {
		let user = await User.getUser({ username: searchresult[i].username});
		let reverseFollowing = await Follower.getFollowers({username: req.session.username,
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

exports.getTweetPost = async function (req, res) {
	let tweet = await Feed.getTweet({ username: req.session.username});
	let user = await User.getUser({ username: req.session.username});
	tweet.sort((a, b) => {
		if (a.createdAt > b.createdAt) { return -1; } else if (a.createdAt < b.createdAt) { return 1; } else { return 0; }
	});
	tweet.unshift(user.name);
	tweet.unshift(user.username);
	tweet.unshift(editpath(user.imageURL));
	res.send(tweet);
};

exports.likePost = async function (req, res) {
	console.log(req.body.likestatus);
	status = req.body.likestatus.trim();
	if (status == 'Like') {
		let tweet = await Feed.getTweet({ _id: req.body.id});
		let tweetlike = tweet[0].like;
		tweetlike.push(req.session.username);
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
