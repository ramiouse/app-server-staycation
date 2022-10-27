const mongoose = require("mongoose");
const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

// module.exports : biar bisa dipake mana saja (import di file lain)
module.exports = mongoose.model("Member", memberSchema);
