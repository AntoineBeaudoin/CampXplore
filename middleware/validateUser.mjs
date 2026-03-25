import User from "../models/user.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const stringEstValide = (v) => {
    return typeof(v) === "string" && v.trim().length > 0;
};

const mdpValide = (v) => {
    const contientMajuscule = (str) => /[A-Z]/.test(str);
    const contientNombre = (str) => /[\d]/.test(str);
    const contientCharSpeciaux = (str) => /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?~]/.test(str);
    const mdpAssezLong = v.length > 10;
    return contientMajuscule(v) && contientNombre(v) && contientCharSpeciaux(v) && mdpAssezLong;
};

const courrielValide = (v) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
}

export const validateUserRegister = async (req, res, next) => {
    const {firstName, lastName, email, password, phone, role} = req.body;
    if(!firstName || !lastName || !email || !password || !phone || !role){
        const error = new Error("firstname, lastname, email, password, phone et role sont requis");
        error.statusCode = 400;
        return next(error);
    }
    
    if(!stringEstValide(firstName) || !stringEstValide(lastName) || !stringEstValide(email) || !stringEstValide(password)){
        const error = new Error("Paramêtre invalide");
        error.statusCode = 422;
        return next(error);
    }

    if(!courrielValide(email)){
        const error = new Error("L'adresse courriel n'est pas valide");
        error.statusCode = 422;
        return next(error);
    }
    
    if (!mdpValide(password)){
        const error = new Error("Mot de passe invalide");
        error.statusCode = 422;
        return next(error);
    }
    
    try{
        if (await User.findOne({ email: email })){
            const error = new Error("Le courriel exite déjà");
            error.statusCode = 409;
            return next(error);
        }
    }
    catch(err){
        next(err);
    }
    next();
}

export const validateLogin = async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        const error = new Error("email et password sont requis");
        error.statusCode = 400;
        return next(error);
    }

    if(!stringEstValide(email) || !stringEstValide(password)){
        const error = new Error("Paramêtre invalide");
        error.statusCode = 422;
        return next(error);
    }
    next();
}

export const validatePut = async (req, res, next) => {
    const {firstName, lastName, phone, role} = req.body;
    if(!firstName || !lastName || !phone || !role){
        const error = new Error("firstname, lastname, phone et role sont requis");
        error.statusCode = 400;
        return next(error);
    }
    
    if(!stringEstValide(firstName) || !stringEstValide(lastName)){
        const error = new Error("Paramêtre invalide");
        error.statusCode = 422;
        return next(error);
    }
    next();
}

export const validatePatch = async (req, res, next) => {
    const {currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword){
        const error = new Error("Mot de passe et nouveau mot de passe sont requis");
        error.statusCode = 400;
        return next(error);
    }
    const infoUser = obtenirInfoToken(req);
    const user = await User.findOne({email: infoUser.email}).select("+password");
    const isEqual = await bcrypt.compare(currentPassword, user.password);
    if (!mdpValide(newPassword)){
        const error = new Error("Mot de passe invalide");
        error.statusCode = 422;
        return next(error);
    }
    if(!isEqual){
        const error = new Error("Mot de passe actuel invalide");
        error.statusCode = 401;
        return next(error);
    }
    next();
}

function obtenirInfoToken(req){
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    let decodeToken;
    decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodeToken;
}