import express from "express";
import * as authController from "../controllers/authController.mjs";
import {validateUserRegister, validateLogin} from "../middleware/validateUser.mjs";
import { isAuth } from "../middleware/isAuth.mjs";

const routeur = express.Router();

routeur.post("/register", validateUserRegister, authController.register);

routeur.post("/login", validateLogin, authController.login);

routeur.get("/profile", isAuth, authController.getProfile);

routeur.put("/profile", authController.updateProfile);

routeur.patch("/password", authController.updatePassword);

export default routeur;