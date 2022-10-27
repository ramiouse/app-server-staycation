const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// before save password
usersSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

// module.exports : biar bisa dipake mana saja (import di file lain)
module.exports = mongoose.model("Users", usersSchema);
