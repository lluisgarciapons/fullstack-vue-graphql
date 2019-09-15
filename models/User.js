const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String
  },
  joinDate: {
    type: Date,
    default: Date.now()
  },
  favorites: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post"
  }
});

module.exports = mongoose.model("User", UserSchema);
