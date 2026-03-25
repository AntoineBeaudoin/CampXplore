import User from "../models/user.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function register(req, res, next){
    const {firstName, lastName, email, password, phone, role} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = new User({
            firstName,
            lastName,
            email,
            password : hashedPassword,
            phone,
            role
        });

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

export async function login(req, res, next){
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email: email}).select("+password");

        if(!user){
            const error = new Error("Courriel ou mot de passe invalide");
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if(!isEqual){
            const error = new Error("Courriel ou mot de passe invalide");
            error.statusCode = 401;
            throw error;
        }

        const userAfficher = user.toObject();
        delete userAfficher.password;
        console.log(user);
        const token = jwt.sign({
                email: user.email,
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            },
        );
        res.status(200).json({
            status: 200,
            message : "Compte utilisateur créer avec succès",
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            data: {
                user: userAfficher,
                token: token
            }
        });
    }
    catch(err){
        next(err);
    }
}


export async function getProfile(req, res, next){
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    let decodeToken;
    decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeToken;
    const user = await User.findOne({email: req.user.email});
    res.status(200).json({
            status: 200,
            message : "Compte récupéré avec succès",
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
}

export async function updateProfile(req, res, next){
    const {firstName, lastName, phone, role} = req.body;
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    let decodeToken;
    decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeToken;
    const id = req.user.id;
    try{
        const user = await User.findByIdAndUpdate(
            id, 
            {
                firstName,
                lastName, 
                phone, 
                role 
            }, 
            {new: true}
        );

        if (user){
            res.status(200).json({
                status: 200,
                path: req.originalUrl,
                timestamp: new Date().toISOString(),
                message : "L'utilisateur a été mis a jours avec succees",
                data: user
            });
        }
        else{
            const error = new Error(`L'utilisateur avec l'id : ${id} est introuvable`);
            error.statusCode = 404;

            throw error;
        }
    }
    catch(err){
        next(err);
    }
}

export async function updatePassword(req, res){
}
