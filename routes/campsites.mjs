import express from "express";
import * as campsitesController from "../controllers/campsitesController.mjs";
import * as validateCampsite from "../middleware/validateCampsite.mjs";
import { isAuth } from "../middleware/isAuth.mjs";

const routeur = express.Router();

routeur.post("/", isAuth, validateCampsite.validateAddNewCampsite ,campsitesController.ajoutCampsite);

routeur.get("/", validateCampsite.validateFiltre, campsitesController.getLesCampings);

routeur.get("/available", campsitesController.rechercherCamping);

routeur.get("/:id", validateCampsite.validateFindById, campsitesController.getCampingViaId);

routeur.put("/:id", isAuth, validateCampsite.validerMAJCampsite, campsitesController.majCamping);

routeur.delete("/:id", campsitesController.delCamping);

export default routeur;