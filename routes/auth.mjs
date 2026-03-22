import express from "express";
import * as authController from "../controllers/authController.mjs";
import {validateUserRegister} from "../middleware/validateUser.mjs"

const routeur = express.Router();

routeur.post("/register", validateUserRegister, authController.register);

routeur.post("/login", authController.login);

routeur.get("/profile", authController.getProfile);

routeur.put("/profile", authController.updateProfile);

routeur.patch("/password", authController.updatePassword);

export default routeur;