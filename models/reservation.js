const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    campsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campsite",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    guests: { type: Number },
    vehicleLength: { type: Number },
    totalPrice: { type: Number },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Reservation", reservationSchema);
