import express from "express";
import * as campsitesController from "../controllers/campsitesController.mjs";
import * as validateCampsite from "../middleware/validateCampsite.mjs";
import { isAuth } from "../middleware/isAuth.mjs";

const routeur = express.Router();

routeur.post("/", isAuth, validateCampsite.validateAddNewCampsite ,campsitesController.ajoutCampsite);

routeur.get("/", campsitesController.getLesCampings);

routeur.get("/:id", isAuth, validateCampsite.validateFindById, campsitesController.getCampingViaId);

routeur.get("/available", campsitesController.rechercherCamping);

routeur.put("/:id", campsitesController.majCamping);

routeur.delete("/:id", campsitesController.delCamping);

export default routeur;