const mongoose = require("mongoose");

const campsiteSchema = new mongoose.Schema(
  {
    name: { type: String },
    location: { type: String },
    description: { type: String },
    type: {
      type: String,
      enum: ["tente", "rv", "chalet", "glamping", "arrière-pays", "autre"],
    },
    pricePerNight: { type: Number },
    capacity: { type: Number },
    maxVehicleLength: {
      type: Number,
    }, // in meters, required for RV sites
    amenities: {
      type: [String],
      enum: [
        "électricité",
        "eau",
        "égout",
        "feu de camp",
        "table de pique-nique",
        "abri",
        "wifi",
        "douche",
        "toilettes",
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Campsite", campsiteSchema);
