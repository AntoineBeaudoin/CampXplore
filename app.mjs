import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// Routes
import dbRoutes from "./routes/db.mjs";
import authRoutes from "./routes/auth.mjs";
import campsitesRoutes from "./routes/campsites.mjs";
import reservationsRoutes from "./routes/reservations.mjs";
import { get404, getErrors } from "./controllers/errorController.mjs";

app.use("/api/db", dbRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/campsites", campsitesRoutes);
app.use("/api/reservations", reservationsRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "API disponnible"
    });
});

app.use("/", get404);
app.use(getErrors);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Le serveur écoute sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
export default app;