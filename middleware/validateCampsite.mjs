import Campsite from "../models/campsite.mjs";
import campsite from "../models/campsite.mjs";
import dotenv from "dotenv";
import * as utils from "../utils.mjs";

export const validateAddNewCampsite = async (req, res, next) => {
    if(!await utils.esAdmin(req)){
        const error = new Error("Vous n'avez pas l'autentification nécessaire");
        error.statusCode = 403;
        return next(error);
    }
    const {name, location, description, type, pricePerNight, capacity} = req.body;
    if (!name || !location || !description || !type || !pricePerNight || !capacity){
        const error = new Error("name, location, description, type, pricePerNight et capacity sont requis");
        error.statusCode = 400;
        return next(error);
    }
    if (!utils.listeDeStringEstValide([name, location, description, type])){
        const error = new Error("Paramêtre invalide");
        error.statusCode = 422;
        return next(error);
    }
    if (await Campsite.find({name: name, location: location})){
        const error = new Error("Ce camping existe déjà");
        error.statusCode = 409;
        return next(error);
    }
    if(pricePerNight <= 0 || capacity <= 0){
        const error = new Error("Le prix par nuit et la capacité doivent être suppérieur à zéro");
        error.statusCode = 400;
        return next(error);
    }
    next();
}
