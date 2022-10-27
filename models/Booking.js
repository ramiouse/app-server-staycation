const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const bookingSchema = new mongoose.Schema({
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  invoice: {
    type: String,
    required: true,
  },
  itemId: {
    _id: {
      type: ObjectId,
      ref: "Item",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  total: {
    type: Number,
    required: true,
  },

  memberId: {
    type: ObjectId,
    ref: "Member",
  },

  bankId: {
    type: ObjectId,
    ref: "Bank",
  },

  // 'payments' collection
  payments: {
    proofPayment: {
      type: String,
      required: true,
    },
    bankFrom: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "process",
    },
    accountHolder: {
      type: String,
      required: true,
    },
  },

  // imageUrl: {
  //   type: String,
  //   required: true,
  // },
});

// module.exports : biar bisa dipake mana saja (import di file lain)
module.exports = mongoose.model("Booking", bookingSchema);
