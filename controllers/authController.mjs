import User from "../models/user.mjs";

export async function register(req, res){
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
        res.status(201).json({
            message : "Compte utilisateur créer avec succès",
            data: article
        });
    }
    catch(err){
        res.status(500).json({
            message : "Erreur lors de la création d'un compte",
            error: err.message,
        });
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
