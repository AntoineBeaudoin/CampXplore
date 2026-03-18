const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'identifiant de l'utilisateur est requis"] 
     },
    campsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campsite",
      required: [true, "L'identifiant du site de camping est requis"] 
    },
    startDate: { 
      type: Date,
      required: [true, "La date de début de la réservation est requise"] 
    },
    endDate: { 
      type: Date, 
      required: [true, "La date de fin de la réservation est requise"] 
    },
    guests: { 
      type: Number,
      min: [1, "Le nombre d'invités doit être suppérieur à 0."]
    },
    vehicleLength: { type: Number },
    totalPrice: { 
      type: Number,
      min: [1, "Le prix total doit être suppérieur à 0."],
      required: [true, "La prix total de la réservation est requis"] 
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Reservation", reservationSchema);
