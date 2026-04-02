import Campsite from "../models/campsite.mjs";
import Reservation from "../models/reservation.mjs";
import dotenv from "dotenv";

dotenv.config();

export async function ajoutCampsite(req, res, next){
    const {name, location, description, type, pricePerNight, capacity, amenities} = req.body;
    try{
        const campsite = new Campsite({name, location, description, 
            type, pricePerNight, capacity, amenities});
        await campsite.save();
        res.location(`/auth/${campsite._id}`)
        res.status(201).json({
            status: 201,
            message : "Campsite créer avec succès",
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            data: {
                _id: campsite._id,
                name: campsite.name,
                location: campsite.location,
                description: campsite.description,
                type: campsite.type,
                pricePerNight: campsite.pricePerNight,
                capacity: campsite.capacity,
                amenities: campsite.amenities
            }
        });
    }
    catch(err){
        next(err);
    }
}

export async function getLesCampings(req, res, next){
    const {type} = req.query;
    try{
        let campsites = null;
        if (type){
            campsites = await Campsite.find({type: type});
        }
        else{
            campsites = await Campsite.find();
        }
        res.status(200).json({
            status: 200,
            message : "Liste de campsite trouvés",
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            data: campsites
        });
    }
    catch(err){
        next(err);
    }
}

export async function getCampingViaId(req, res, next){
    const id = req.params.id;
    try{
        const campsite = await Campsite.findById(id);
        if(campsite){
            res.status(200).json({
                status: 200,
                message : "Campsite récupéré avec succès",
                path: req.originalUrl,
                timestamp: new Date().toISOString(),
                data: campsite
            });
        }
        else{
            const error = new Error(`Le campsite d'id ${id} n'a pas été trouvé`);
            error.statusCode = 404;
            return next(error);
        }
    }
    catch(err){
        next(err);
    }
}

export async function rechercherCamping(req, res, next){
    const {startDate, endDate, type, guests, vehicleLength} = req.query;
    try{
        const reservations = await Reservation.find({startDate: { $lt: endDate}, endDate: { $gt: startDate}});
        const idsCampsites = reservations.map(r => r.campsite._id)
        let campsites = null;
        if(type){
            if(type === "rv" && vehicleLength){
                campsites = await Campsite.find({_id: {$nin: idsCampsites}, type: type, maxVehicleLength: {$gte: vehicleLength}});
            }
            else{
                campsites = await Campsite.find({_id: {$nin: idsCampsites}, type: type});
            }
        }
        if(guests){
            campsites = await Campsite.find({_id: {$nin: idsCampsites}, capacity: {$gte: guests}});
        }
        if(campsites === null){
            campsites = await Campsite.find({_id: {$nin: idsCampsites}});
        }
        if(campsites){
            res.status(200).json({
                status: 200,
                message : "Campsite récupéré avec succès",
                path: req.originalUrl,
                timestamp: new Date().toISOString(),
                data: campsites
            });
        }
        else{
            const error = new Error(`Aucun campsites trouvés`);
            error.statusCode = 404;
            return next(error);
        }
    }
    catch(err){
        next(err);
    }
}

export async function majCamping(req, res, next){
    const id = req.params.id;
    const {name, location, description, type, pricePerNight, capacity, amenities} = req.body;
    try{
        const campsite = await Campsite.findByIdAndUpdate(
            id, 
            {
                name, 
                location, 
                description, 
                type, 
                pricePerNight, 
                capacity, 
                amenities
            }, 
            {new: true}
        );

        if (campsite){
            res.status(200).json({
                status: 200,
                path: req.originalUrl,
                timestamp: new Date().toISOString(),
                message : "Le campsite a été mis à jours avec succèes",
                data: campsite
            });
        }
        else{
            const error = new Error(`Le campsite avec l'id : ${id} est introuvable`);
            error.statusCode = 404;
            next(error);
        }
    }
    catch(err){
        next(err);
    }
}

export async function delCamping(req, res, next){
    const id = req.params.id;
    try{
        const reservations = await Reservation.find({campsite : id});
        if (reservations.length !== 0){
            const error = new Error(`Le campsite avec l'id : ${id} a des réservations`);
            error.statusCode = 409;
            return next(error);
        }
        await Campsite.findByIdAndDelete(id); 
        res.status(204).json({
                status: 204,
                path: req.originalUrl,
                timestamp: new Date().toISOString(),
                message : "Le campsite a été supprimé avec succèes"
            });
    }
    catch(err){
        next(err);
    }
}
