import Campsite from "../models/campsite.mjs";
import * as utils from "../utils.mjs";

export const validateAddNewCampsite = async (req, res, next) => {
    if(!await utils.esAdmin(req)){
        const error = new Error("Vous n'avez pas l'autentification nécessaire");
        error.statusCode = 403;
        return next(error);
    }
    const {name, location, description, type, pricePerNight, capacity} = req.body;
    if (!name || !location || !description || !type || !pricePerNight || capacity === undefined){
        const error = new Error("name, location, description, type, pricePerNight et capacity sont requis");
        error.statusCode = 400;
        return next(error);
    }
    if (!utils.listeDeStringEstValide([name, location, description, type])){
        const error = new Error("Paramêtre invalide");
        error.statusCode = 422;
        return next(error);
    }
    if(pricePerNight <= 0 || capacity <= 0){
        const error = new Error("Le prix par nuit et la capacité doivent être suppérieur à zéro");
        error.statusCode = 422;
        return next(error);
    }
    if ((await Campsite.find({name: name, location: location})).length == 1){
        const error = new Error("Ce camping existe déjà");
        error.statusCode = 409;
        return next(error);
    }
    if(!Campsite.schema.path("type").enumValues.includes(type)){
        const error = new Error("Le type du camping doit être un des suivants: tente, rv, chalet, glamping, arrière-pays ou autre");
        error.statusCode = 422;
        return next(error);
    }
    if(type === "rv"){
        const {maxVehicleLength} = req.body;
        if (maxVehicleLength <= 0){
            const error = new Error("Le maxVehicleLength doit être suppérieur à 0");
            error.statusCode = 422;
            return next(error);
        }
    }
    next();
}
