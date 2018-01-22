const mongoose = require('mongoose');
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
  },
  followstatus: {
    type: Boolean,
  }
});

