import express from "express";
import * as reservationsController from "../controllers/reservationsController.mjs";

const routeur = express.Router();

routeur.post("/", reservationsController.ajoutReservation);

routeur.get("/", reservationsController.getReservations);

routeur.get("/:id", reservationsController.getReservationsViaId);

routeur.put("/:id", reservationsController.majReservation);

routeur.patch("/:id", reservationsController.majStatutReservation);

export default routeur;
