import Reservation from "../models/reservation.mjs";
import Campsite from "../models/campsite.mjs";
import * as utils from "../utils.mjs";

export async function ajoutReservation(req, res, next){
    const {campsite, startDate, endDate, guests} = req.body
    const dateDebut = new Date(startDate);
    const dateFin = new Date(endDate);
    req.user = utils.obtenirInfoToken(req);
    const userId = req.user.id;
    try{
        const campsiteSelectionne = await Campsite.findById(campsite);
        const nombreJours = differenceDates(dateDebut, dateFin)
        const coutTotal = campsiteSelectionne.pricePerNight * nombreJours;
        const reservation = new Reservation({
            user: userId, campsite: campsite, startDate: dateDebut,
            endDate: dateFin, guests: guests, totalPrice: coutTotal});
        await reservation.save();

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

export async function getReservationsViaId(req, res, next){
}

export async function majReservation(req, res, next){
}

export async function majStatutReservation(req, res, next){
}

function differenceDates(startDate, endDate){
    const diffTemps = Math.abs(endDate - startDate);
    return Math.floor(diffTemps / (1000 * 60 * 60 * 24));
}
