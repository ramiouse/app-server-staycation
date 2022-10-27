const mongoose = require("mongoose");
const bankSchema = new mongoose.Schema({
  nameBank: {
    type: String,
    required: true,
  },
  nomorRekening: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

// module.exports : biar bisa dipake mana saja (import di file lain)
module.exports = mongoose.model("Bank", bankSchema);
