import Reservation from "../models/reservation.mjs";
import Campsite from "../models/campsite.mjs";
import * as utils from "../utils.mjs";

/**
 * Crée une réservation et l'ajoute à la base de données
 * @param {*} req Requête Express (contient les données utilisateur dans req.body)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 */
export async function ajoutReservation(req, res, next){
    const {campsite, startDate, endDate, guests} = req.body
    const dateDebut = new Date(startDate);
    const dateFin = new Date(endDate);
    try{
        const reservation = await creerReservation(campsite, dateDebut, dateFin, guests, req);
        res.status(201).location(`/api/reservations/${reservation._id}`).json({
            status: 201,
            message : "Réservation créer avec succès",
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            data: {
                _id: reservation._id,
                user: reservation.user,
                campsite: reservation.campsite,
                startDate: reservation.startDate,
                endDate: reservation.endDate,
                guests: reservation.guests,
                totalPrice: reservation.totalPrice,
                status: reservation.status
            }
        });
    }
    catch(err){
        next(err);
    }
}

/**
 * Retourne les réservation de l'utilisateur connecté
 * @param {*} req Requête Express (contient les données d'authentification)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 */
export async function getReservations(req, res, next){
    req.user = utils.obtenirInfoToken(req);
    const userId = req.user.id;
    const {status} = req.query;
    try{
        let reservations = "";
        if (status){
            reservations = await Reservation.find({user: userId, status: status});
        }
        else{
            reservations = await Reservation.find({user: userId});
        }
        res.status(200).json({
            status: 200,
            message : "Réservations de l'utilisateur",
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            data: reservations
        });
    }
    catch(err){
        next(err);
    }
}

/**
 * Retourne la réservation avec l'Id passé en paramêtre
 * @param {*} req Requête Express (contient les données de la réservation dans req.params)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 */
export async function getReservationsViaId(req, res, next){
    const id = req.params.id;
    try{
        const reservation = await Reservation.findById(id);
        res.status(200).json({
            status: 200,
            message : `Réservations avec l'id ${id}`,
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            data: reservation
        });
    }
    catch(err){
        next(err);
    }
}

/**
 * Met à jours la réservation avec l'id passé en paramêtre
 * @param {*} req Requête Express (contient les données de la réservation dans req.body et 
 *                l'id de la réservation dans req.params)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export async function majReservation(req, res, next){
    const idReservation = req.params.id;
    const {campsite, startDate, endDate, guests} = req.body
    const dateDebut = new Date(startDate);
    const dateFin = new Date(endDate);
    try{
        const reservation = await mettreAJoursUneReservationById(idReservation, campsite, dateDebut, dateFin, guests, req);
        if (!reservation){
            const error = new Error(`Aucune réservation avec l'id ${idReservation} a été trouvé`);
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json({
            status: 200,
            message : "Réservations de l'utilisateur mis a jours avec succès",
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            data: reservation
        });
    }
    catch(err){
        next(err);
    }
}

/**
 * Met à jours le statut d'une réservation et applique le changement dans la BD
 * @param {*} req Requête Express (contient les données de status dans req.body)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 */
export async function majStatutReservation(req, res, next){
    const id = req.params.id;
    const {status} = req.body;
    try{
        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
        res.status(200).json({
            status: 200,
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            message : "La réservation a été mis à jours avec succèes",
            data: reservation
        });
    }
    catch(err){
       next(err); 
    }
}

/**
 * Calcule la différence entre deux dates
 * @param {*} startDate Date du début
 * @param {*} endDate Date de fin
 * @returns Le nombre de jours séparant ces deux dates
 */
function differenceDates(startDate, endDate){
    const diffTemps = Math.abs(endDate - startDate);
    return Math.floor(diffTemps / (1000 * 60 * 60 * 24));
}

/**
 * Créer un objet réservation, le sauvegarde et retourne l'objet sauvegardé
 * @param {*} campsite Id du campsite lié à la réservation
 * @param {*} dateDebut Date de début de la réservation
 * @param {*} dateFin Date de fin de la réservation
 * @param {*} guests Nombre d'invités
 * @param {*} req La req
 * @returns Retourne un objet réservation une fois que celui-ci a été ajouté à la BD
 */
const creerReservation = async (campsite, dateDebut, dateFin, guests, req) => {
    const {userId, coutTotal} = await obtenirInfoPourReservation(campsite, dateDebut, dateFin, req);
    const reservation = new Reservation({
        user: userId, campsite: campsite, startDate: dateDebut,
        endDate: dateFin, guests: guests, totalPrice: coutTotal});
    await reservation.save();
    return reservation;
}

/**
 * Recherche et retourne les paramêtres manquants pour créer une réservation. (id de l'utilisateur et le coût total de la réservation)
 * @param {*} campsite Id du campsite lié à la réservation
 * @param {*} dateDebut Date de début de la réservation
 * @param {*} dateFin Date de fin de la réservation
 * @param {*} req La req
 * @returns L'id de l'utilisateur et le coût total de la réservation
 */
const obtenirInfoPourReservation = async (campsite, dateDebut, dateFin, req) => {
    req.user = utils.obtenirInfoToken(req);
    const userId = req.user.id;
    const campsiteSelectionne = await Campsite.findById(campsite);
    const nombreJours = differenceDates(dateDebut, dateFin)
    const coutTotal = campsiteSelectionne.pricePerNight * nombreJours;
    return {userId, coutTotal};
}

/**
 * Met à jours une réservation grâce aux paramêtres.
 * @param {*} idReservation Id de la réservation à mettre à jours
 * @param {*} campsite Id du campsite lié à la réservation
 * @param {*} dateDebut Date de début de la réservation
 * @param {*} dateFin Date de fin de la réservation
 * @param {*} guests Nombre d'invités
 * @param {*} req La req
 * @returns Retourne un objet réservation
 */
const mettreAJoursUneReservationById = async(idReservation, campsite, dateDebut, dateFin, guests, req) => {
    const {userId, coutTotal} = await obtenirInfoPourReservation(campsite, dateDebut, dateFin, req);
    const reservation = await Reservation.findByIdAndUpdate(
        idReservation, 
        {
            user: userId, 
            campsite: campsite, 
            startDate: dateDebut,
            endDate: dateFin, 
            guests: guests, 
            totalPrice: coutTotal
        }, 
        {new: true}
    );
    return reservation;
}
