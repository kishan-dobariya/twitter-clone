const mongoose = require('mongoose');
var FeedSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  tweet: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required : true,
  },
  createdAt: {
    type:Date,
    default:function() {
      return new Date();
    },
  },
  updatedAt: {
    type:Date,
    // ref:'User'
  },
});

let Feed = module.exports = mongoose.model('feed', FeedSchema);

module.exports.createTweet = function(newFeed, callback) {
  newFeed.save(callback);
}

module.exports.getTweet = function(query, callback) {
   return new Promise((resolve, reject) => {
    Feed.find(query, function(err ,data) {
      if(err) {
        reject(err);
      }
      resolve(data);
    });
  })
}
