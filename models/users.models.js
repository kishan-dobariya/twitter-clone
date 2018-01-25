const mongoose = require('mongoose');
let bcrypt = require('bcrypt');
var UserSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type:Date,
    default:function() {
      return new Date();
    }
  },
  deletedAt: {
    type: Date,
    default: "",
  },
  updatedAt: {
    type:Date,
    default:function() {
      return new Date();
    },
  },
  updatedBy: {
    type:String,
    ref:'User'
  },
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
  website: {
    type: String,
  },
  birthdate: {
    type:Date,
  },
  imageURL: {
      type: String,
  }
});
var User = module.exports = mongoose.model('users', UserSchema);
module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      if(err){
        console.log("err");
      }
      console.log("hash-------..------->",hash);
      newUser.password = hash;
      console.log("np-->",newUser.password);
      newUser.save(callback);
    });
  });
}
module.exports.getUser = function(query) {
  return new Promise((resolve, reject) => {
    User.findOne(query, function(err ,data) {
      if(err) {
        reject(err);
      }
      resolve(data);
    });
  })
}

module.exports.updatePassword = function(query, newPassword){
  return new Promise((resolve, reject) => {
    User.update(query, { $set : {password : newPassword}}, function(err ,data) {
      if(err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

module.exports.updateProfile = function(query, name, bio, mail,location, dob, path){
  return new Promise((resolve, reject) => {
    if(path !== "not difined"){
      console.log("model if");
    User.update(query, { $set : {name : name, bio : bio, email : mail, location : location, birthdate : dob, imageURL : path}}, function(err ,data) {
      if(err) {
        reject(err);
      }
        resolve(data);
    });
  }
  else{
    console.log("modelelse");
    User.update(query, { $set : {name : name, bio : bio, email : mail, location : location, birthdate : dob}}, function(err ,data) {
      if(err) {
        reject(err);
      }
        resolve(data);
    });
  }
  });
}


module.exports.searchUser = function(user, callback) {
    console.log(user);
    return new Promise((resolve, reject) => {
    User.find(user, function(err ,data) {
      if(err) {
        reject(err);
      }
      resolve(data);
    });
    })
}
