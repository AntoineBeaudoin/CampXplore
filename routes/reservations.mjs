import express from "express";
import * as reservationsController from "../controllers/reservationsController.mjs";
import { isAuth } from "../middleware/isAuth.mjs";

const routeur = express.Router();

routeur.post("/", isAuth, reservationsController.ajoutReservation);

routeur.get("/", isAuth, reservationsController.getReservations);

routeur.get("/:id", isAuth, reservationsController.getReservationsViaId);

routeur.put("/:id", isAuth, reservationsController.majReservation);

routeur.patch("/:id", isAuth, reservationsController.majStatutReservation);

export default routeur;
