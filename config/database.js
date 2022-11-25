const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  name: String,
  googleId: String,
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
