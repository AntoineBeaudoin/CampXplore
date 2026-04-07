import Campsite from "../models/campsite.mjs";
import * as utils from "../utils.mjs";

const regexIdMongoDB = /[a-fA-F0-9]{24}/;

/**
 * Valide si le type utilisé pour le filtre de campsite est un type valide
 * @param {*} req Requête Express (contient les données du filtre dans req.query)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export const validateFiltre = async (req, res, next) => {
    const {type} = req.query;
    if(type && !Campsite.schema.path("type").enumValues.includes(type)){
        const error = new Error("Le type du camping doit être un des suivants: tente, rv, chalet, glamping, arrière-pays ou autre");
        error.statusCode = 422;
        return next(error);
    }
    next();
}

/**
 * Valide si les paramètres pour l'ajout d'un nouveau campsite sont respectés
 * @param {*} req Requête Express (contient les données du campsite dans req.body)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 */
export const validateAddNewCampsite = async (req, res, next) => {
    await validerPropsCamping(req, res, next);
}

/**
 * Vérifie si l'id passé en paramètres est un id valide
 * @param {*} req Requête Express (contient les données du campsite dans req.params)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export const validateFindById = async (req, res, next) => {
    const id = req.params.id;
    if(!regexIdMongoDB.test(id)){
        const error = new Error("L'id ne respecte pas le format des id de mongoDB");
        error.statusCode = 400;
        return next(error);
    }
    next();
}

/**
 * Valide si les paramètres pour la mise à jours d'un nouveau campsite sont respectés
 * @param {*} req Requête Express (contient les données du campsite dans req.body)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 */
export const validerMAJCampsite = async (req, res, next) => {
    await validerPropsCamping(req, res, next);
}

/**
 * Vérifie si l'utilisateur connecté est un administrateur pour effectuer la supression
 * @param {*} req Requête Express (contient les données de l'utilisateur connecté)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export const validateDeleteCampsite = async (req, res, next) => {
    if(!await utils.esAdmin(req)){
        const error = new Error("Vous n'avez pas l'autentification nécessaire");
        error.statusCode = 403;
        return next(error);
    }
    next();
}


/**
 * Valide si les propriétés d'in campsite sont valide
 * @param {*} req Requête Express (contient les données du campsite dans req.body 
 *                et contient les données de l'utilisateur connecté)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
const validerPropsCamping = async (req, res, next) => {
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
        if (!maxVehicleLength){
            const error = new Error("Le maxVehicleLength doit être inclus lorsque le type de camping est rv");
            error.statusCode = 400;
            return next(error);
        }
    }
    const { id } = req.params;
    let existing;
    if (!id) {
        existing = await Campsite.findOne({name, location});
    } else {
        existing = await Campsite.findOne({name, location, _id: { $ne: id }});
    }
    if (existing) {
        const error = new Error("Ce camping existe déjà");
        error.statusCode = 409;
        return next(error);
    }
    next();
}
