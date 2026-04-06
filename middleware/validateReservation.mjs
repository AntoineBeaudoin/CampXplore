import Campsite from "../models/campsite.mjs";
import Reservation from "../models/reservation.mjs";
import dotenv from "dotenv";
import * as utils from "../utils.mjs";
import User from "../models/user.mjs";

dotenv.config();

/**
 * Valide si les paramètres de la réservation sont valides et si le camping n'existe pas déjà.
 * @param {*} req Requête Express (contient les données de la réservation dans req.body)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
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

/**
 * Valide que le status est passé en paramètre est un paramètre valide
 * @param {*} req Requête Express (contient les données pour la recherche dans req.query)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export const validateGetReservation = async (req, res, next) => {
    const {status} = req.query;
    if(status && !Reservation.schema.path("status").enumValues.includes(status)){
        const error = new Error("Le status du camping doit être un des suivants: pending, confirmed ou cancelled");
        error.statusCode = 422;
        return next(error);
    }
    next();
}

/**
 * Valide si l'utilisateur est le propriétaire de la réservation ou un admin
 * @param {*} req Requête Express (contient les données de la réservation dans req.body)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export const validateReservationProprietaireOuAdmin = async (req, res, next) => {
    const idCampsite = req.params.id;
    req.user = utils.obtenirInfoToken(req);
    const userId = req.user.id;
    try{
        const reservation = await Reservation.findById(idCampsite);
        if(!reservation){
            const error = new Error(`La réservation avec l'id ${idCampsite} n'a pas été trouvé`);
            error.statusCode = 404;
            return next(error);
        }
        if (reservation.user.toString() !== userId){
            const utilisateur = await User.findById(userId);
            if (utilisateur.role !== "admin"){
                const error = 
                new Error("Vous ne pouvez pas accèder à une réservation à laquelle vous n'êtes pas propriétaire ou Admin.");
                error.statusCode = 422;
                return next(error);
            }
        }
    }
    catch(err){
        return next(err);
    }
    next();
}

/**
 * Valide si la modification d'une réservation peut être effectué
 * @param {*} req Requête Express (contient les données de la réservation dans req.body 
 *                et l'id de la réservation dans req.params)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export const validateAutoriserAModifierReservation = async (req, res, next) => {
    const id = req.params.id;
    const {status} = req.body;
    let reservation = "";
    if(!Reservation.schema.path("status").enumValues.includes(status)){
        const error = new Error("Le status du camping doit être un des suivants: pending, confirmed ou cancelled");
        error.statusCode = 422;
        return next(error);
    }
    try {
        reservation = await Reservation.findById(id);
        if (!reservation){
            const error = new Error(`La réservation avec l'id : ${id} est introuvable`);
            error.statusCode = 404;
            return next(error);
        }
    } 
    catch (err){
        return next(err);
    }
    const premiereJourneeReservation = new Date(reservation.startDate).getTime();
    if(status === "cancelled" && premiereJourneeReservation > Date.now()){
        return next();
    }
    if(!await utils.esAdmin(req) && reservation.status !== "pending"){
        const error = new Error("Vous devez être un administrateur pour modifier une réservation qui n'est pas pending");
        error.statusCode = 400;
        next(error);
    }
    next();
}