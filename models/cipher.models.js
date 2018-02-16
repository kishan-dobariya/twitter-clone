const mongoose = require('mongoose');
let bcrypt = require('bcrypt');
var cipherSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  cipher: {
    type: String,
    required: true
  },
  Status:{
    type: Boolean,
    default: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: function () {
      return new Date();
    }
  },
});

var cipher = module.exports = mongoose.model('cipher', cipherSchema);

module.exports.createCipher = function (newCipher, callback) {
  newCipher.save(callback);
};

module.exports.getCipher = function (query, callback) {
  return new Promise((resolve, reject) => {
    cipher.find(query, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

module.exports.updateStatus = function (query, newstatus) {
  return new Promise((resolve, reject) => {
    cipher.updateOne(query, newstatus, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
