import express from "express";
import * as authController from "../controllers/authController.mjs";

const routeur = express.Router();

routeur.post("/auth/register", authController.register);

routeur.post("/auth/login", authController.login);

routeur.get("/auth/profile", authController.getProfile);

routeur.put("/auth/profile", authController.updateProfile);

routeur.patch("/auth/password", authController.updatePassword);

export default routeur;