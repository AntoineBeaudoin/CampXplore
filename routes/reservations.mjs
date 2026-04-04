import express from "express";
import * as validateRservation from "../middleware/validateReservation.mjs"
import * as reservationsController from "../controllers/reservationsController.mjs";
import { isAuth } from "../middleware/isAuth.mjs";

const routeur = express.Router();

routeur.post("/", isAuth, validateRservation.validateAjoutReservation, reservationsController.ajoutReservation);

routeur.get("/", isAuth, reservationsController.getReservations);

routeur.get("/:id", isAuth, reservationsController.getReservationsViaId);

routeur.put("/:id", isAuth, reservationsController.majReservation);

routeur.patch("/:id", isAuth, reservationsController.majStatutReservation);

export default routeur;
