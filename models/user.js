const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String,
      required: [true, "Le prénom est requis"] 
    },
    lastName: { 
      type: String,
      required: [true, "Le nom est requis"] 
    },
    email: { 
      type: String, 
      unique: [true, "Le courriel doit être unique"],
      validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) =>
        `${props.value} n'est pas un courriel valide!`,
      },
    },
    phone: { 
      type: String,
      validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) =>
        `${props.value} n'est pas un numéro de téléphone valide! Il doit contenir exactement 10 chiffres.`,
    },
    },
    password: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
