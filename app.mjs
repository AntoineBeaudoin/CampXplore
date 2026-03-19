import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
import dbRoutes from "./routes/db.mjs";
import authRoutes from "./routes/auth.mjs";
import campsitesRoutes from "./routes/campsites.mjs";
import reservationsRoutes from "./routes/reservations.mjs";

app.use("/api/db", dbRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/campsites", campsitesRoutes);
app.use("/api/reservations", reservationsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
