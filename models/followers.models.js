const mongoose = require('mongoose');
var followerSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  following: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required : true,
  },
  createdAt: {
    type:Date,
    default:function() {
      return new Date();
    },
  },
});

var Follower = module.exports = mongoose.model('follower', followerSchema);
module.exports.createFollower = function(newFollwer, callback) {
    // console.log("newFollwer-->",newFollwer);
      newFollwer.save(callback);
}

module.exports.getFollower = function(newFollwer, callback) {
  // console.log("foloer to find",newFollwer);
   return new Promise((resolve, reject) => {
    Follower.findOne(newFollwer, function(err ,data) {
      if(err) {
        reject(err);
      }
      // console.log(" --------",data);
      resolve(data);
    });
  })
}

module.exports.searchUser = function(user, callback) {
  // console.log(user);
  return new Promise((resolve, reject) => {
  Follower.find(user, function(err ,data) {
    if(err) {
      reject(err);
    }
    resolve(data);
  });
  })
}

module.exports.getFollowers = function(user, callback) {
  // console.log(user);
  return new Promise((resolve, reject) => {
  Follower.count(user, function(err ,data) {
    if(err) {
      reject(err);
    }
    resolve(data);
  });
  })
}

module.exports.updateStatus = function(query, newstatus){
  // console.log("aaaaaaaa",newstatus)
  // console.log("aaaaaaaa",query)
  return new Promise((resolve, reject) => {
    Follower.update(query, { $set : {status : newstatus, }}, function(err ,data) {
      if(err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
