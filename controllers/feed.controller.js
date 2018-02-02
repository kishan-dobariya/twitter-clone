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

