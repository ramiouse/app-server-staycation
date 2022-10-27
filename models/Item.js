const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sumBooking: {
    type: Number,
    default: 0,
  },
  country: {
    type: String,
    default: "Indonesia", // default value
  },
  city: {
    type: String,
    required: true,
  },

  isPopular: {
    type: Boolean,
    default: false,
  },

  description: {
    type: String,
    required: true,
  },

  unit: {
    type: String,
    default: "night",
  },
  // ---------------------
  categoryId: {
    type: ObjectId,
    ref: "Category",
  },

  imageId: [
    {
      type: ObjectId,
      ref: "Image",
    },
  ],

  // create on fiture is created
  featuredId: [
    {
      type: ObjectId,
      ref: "Feature",
    },
  ],
  activityId: [
    {
      type: ObjectId,
      ref: "Activity",
    },
  ],
});

// module.exports : biar bisa dipake mana saja (import di file lain)
module.exports = mongoose.model("Item", itemSchema);
