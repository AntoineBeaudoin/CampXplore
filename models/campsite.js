const mongoose = require("mongoose");

const campsiteSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Le nom du camping est requis"] 
    },
    location: { 
      type: String,
      required: [true, "La location du camping est requis"] 
    },
    description: { type: String },
    type: {
      type: String,
      enum: ["tente", "rv", "chalet", "glamping", "arrière-pays", "autre"],
      required: [true, "Le type du camping est requis"] 
    },
    pricePerNight: { 
      type: Number,
      required: [true, "Le prix par nuit du camping est requis"],
      min: [1, "Le prix par nuit doit être suppérieur à 0."]
    },
    capacity: { 
      type: Number,
      required: [true, "La capacité du camping est requis"],
      min: [1, "La capacité du camping doit être suppérieur à 0."] 
    },
    maxVehicleLength: {
      type: Number,
      required: function() {
        return this.type === "rv";
      },
      min: [1, "La longueur doit être supérieure à 0"]
    },
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
