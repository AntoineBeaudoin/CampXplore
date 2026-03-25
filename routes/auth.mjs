import express from "express";
import * as authController from "../controllers/authController.mjs";
import * as validateUser from "../middleware/validateUser.mjs";
import { isAuth } from "../middleware/isAuth.mjs";

const routeur = express.Router();

routeur.post("/register", validateUser.validateUserRegister, authController.register);

routeur.post("/login", validateUser.validateLogin, authController.login);

routeur.get("/profile", isAuth, authController.getProfile);

routeur.put("/profile", isAuth, validateUser.validatePut, authController.updateProfile);

routeur.patch("/password", authController.updatePassword);

export default routeur;