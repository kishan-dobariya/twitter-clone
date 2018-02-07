let User = require('../models/users.models');
let session = require('express-session');
let Feed = require('../models/userfeed.models');

exports.insertPost = async function(req, res, next){
  if(req.body.tweet !== ""){
    let newTweet = new Feed( { username : req.session.username,
                              tweet : req.body.tweet,
                              status : "new" } );
    await Feed.createTweet(newTweet, function(err, tweetInfo) {
      if(err) {
        throw err;
      }
    });
  res.send()
  }
}

exports.edittweetPost = async function(req, res, next){
  console.log("body",req.body);
  await Feed.updateTweet({ _id : req.body.tweetId}, req.body.newTweet)
      .then(function (argument) {
        console.log(argument)
        res.send(true);
      }).catch(function(argument) {
        console.log(argument)
      });
  // let newTweet = new Feed( { username : req.session.username,
  //                           tweet : req.body.tweet,
  //                           status : "new" } );
  // await Feed.createTweet(newTweet, function(err, tweetInfo) {
  //   if(err) {
  //     throw err;
  //   }
  // });
  res.send(null)
}
