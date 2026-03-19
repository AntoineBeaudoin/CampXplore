import express from "express";
import * as authController from "../controllers/authController.mjs";

const routeur = express.Router();

routeur.post("/register", authController.register);

routeur.post("/login", authController.login);

routeur.get("/profile", authController.getProfile);

routeur.put("/profile", authController.updateProfile);

routeur.patch("/password", authController.updatePassword);

export default routeur;