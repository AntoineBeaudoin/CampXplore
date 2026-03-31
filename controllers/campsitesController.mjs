import Campsite from "../models/campsite.mjs";

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
}

export async function getCampingViaId(req, res, next){
}

export async function rechercherCamping(req, res, next){
}

export async function majCamping(req, res, next){
}

export async function delCamping(req, res, next){
}
