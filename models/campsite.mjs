import mongoose from "mongoose";

const campsiteSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Le nom du site de camping est requis"] 
    },
    location: { 
      type: String,
      required: [true, "La location site de du camping est requis"] 
    },
    description: { type: String },
    type: {
      type: String,
      enum: ["tente", "rv", "chalet", "glamping", "arrière-pays", "autre"],
      required: [true, "Le type du site de camping est requis"] 
    },
    pricePerNight: { 
      type: Number,
      required: [true, "Le prix par nuit du site de camping est requis"],
      min: [1, "Le prix par nuit doit être suppérieur à 0."]
    },
    capacity: { 
      type: Number,
      required: [true, "La capacité du site de camping est requis"],
      min: [1, "La capacité du site de site de camping doit être suppérieur à 0."] 
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

export default mongoose.model("Campsite", campsiteSchema);
