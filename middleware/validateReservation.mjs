import bcrypt from "bcrypt";
import Campsite from "../models/campsite.mjs";
import dotenv from "dotenv";
import * as utils from "../utils.mjs";

dotenv.config();

export const validateAjoutReservation = async (req, res, next) => {
    const {campsite, startDate, endDate, guests} = req.body
    if(new Date(startDate) > new Date(endDate)){
        const error = new Error("La date de début ne peut pas être plus après la date de fin");
        error.statusCode = 422;
        return next(error);
    }
    try{
        const campsiteSelectionne = await Campsite.findById(campsite);
        if(campsiteSelectionne === null){
            const error = new Error("Le camping désiré est introuvable");
            error.statusCode = 404;
            return next(error);
        }
        if(guests > campsiteSelectionne.capacity){
            const error = new Error("Le nombre de guests excède le nombre de guests que permet le campsite.");
            error.statusCode = 400;
            return next(error);
        }
    }
    catch(err){
        next(err);
    }
    next();
}

// (!await utils.esAdmin(req))