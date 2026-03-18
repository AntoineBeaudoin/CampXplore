import express from "express";
import * as campsitesController from "../controllers/campsitesController.mjs";

const routeur = express.Router();

routeur.post("/", campsitesController.ajoutCampsite);

routeur.get("/", campsitesController.getLesCampings);

routeur.get("/:id", campsitesController.getCampingViaId);

routeur.get("/available", campsitesController.rechercherCamping);

routeur.put("/:id", campsitesController.majCamping);

routeur.delete("/:id", campsitesController.delCamping);

export default routeur;