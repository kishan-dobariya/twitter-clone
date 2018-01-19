const mongoose = require('mongoose');
//const app = require('../app');
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
  //console.log("--->",newUser.password);

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
  //console.log("result------>"+User.update(query, { $set : {password : newPassword}}))
}



module.exports.updateProfile = function(query, name, bio, mail,location, dob){
  return new Promise((resolve, reject) => {
    User.update(query, { $set : {name : name, bio : bio, email : mail, location : location, birthdate : dob}}, function(err ,data) {
      if(err) {
        reject(err);
      }
        resolve(data);
    });
  });
}
