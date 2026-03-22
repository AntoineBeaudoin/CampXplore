import User from "../models/user.mjs";

export async function register(req, res, next){
    const {firstName, lastName, email, password, phone, role} = req.body;
    const user = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        role
    });
    try{
        await user.save();
        res.location(`/auth/${user._id}`)
        const userAfficher = user.toObject();
        delete userAfficher.password;
        res.status(201).json({
            status: 201,
            message : "Compte utilisateur créer avec succès",
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            data: {
                user: userAfficher
            }
        });
    }
    catch(err){
        next(err);
    }
}

export async function login(req, res){
}

export async function getProfile(req, res){
}

export async function updateProfile(req, res){
}

export async function updatePassword(req, res){
}
