const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});

// module.exports : biar bisa dipake mana saja (import di file lain)
module.exports = mongoose.model("Image", imageSchema);
