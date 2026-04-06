import User from "../models/user.mjs";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import * as utils from "../utils.mjs";

dotenv.config();

/**
 * Valide si le mot de passe respecte le format demandé
 * @param {*} v String à valider
 * @returns Booléen indiquant si le mot de passe est valide
 */
const mdpValide = (v) => {
    const contientMajuscule = (str) => /[A-Z]/.test(str);
    const contientNombre = (str) => /[\d]/.test(str);
    const contientCharSpeciaux = (str) => /[@$!%*?&]/.test(str);
    const mdpAssezLong = v.length > 10;
    return contientMajuscule(v) && contientNombre(v) && contientCharSpeciaux(v) && mdpAssezLong;
};

/**
 * Valide si le courriel respecte le format demandé
 * @param {*} v String à valider
 * @returns Booléen indiquant si le courriel est valide
 */
const courrielValide = (v) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
}

/**
 * Valide si les paramètres envoyé pour "register" un utilisateur sont valides 
 * @param {*} req Requête Express (contient les données de l'utilisateur dans req.body)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export const validateUserRegister = async (req, res, next) => {
    const {firstName, lastName, email, password, phone, role} = req.body;
    if(!firstName || !lastName || !email || !password || !phone || !role){
        const error = new Error("firstname, lastname, email, password, phone et role sont requis");
        error.statusCode = 400;
        return next(error);
    }
    if(!utils.listeDeStringEstValide([firstName, lastName, email, password])){
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

/**
 * Valide si les paramètres envoyé pour se connecter sont valides et présent.
 * @param {*} req Requête Express (contient les données de l'utilisateur dans req.body)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export const validateLogin = async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        const error = new Error("email et password sont requis");
        error.statusCode = 400;
        return next(error);
    }
    if(!utils.listeDeStringEstValide([email, password])){
        const error = new Error("Paramêtre invalide");
        error.statusCode = 422;
        return next(error);
    }
    next();
}

/**
 * Valide si les paramètres envoyé pour modifier un compte utilisateur sont valides 
 * @param {*} req Requête Express (contient les données de l'utilisateur dans req.body)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export const validatePut = async (req, res, next) => {
    const {firstName, lastName, phone, role} = req.body;
    if(!firstName || !lastName || !phone || !role){
        const error = new Error("firstname, lastname, phone et role sont requis");
        error.statusCode = 400;
        return next(error);
    }
    
    if(!utils.listeDeStringEstValide([firstName, lastName])){
        const error = new Error("Paramêtre invalide");
        error.statusCode = 422;
        return next(error);
    }
    next();
}
/**
 * Valide si les paramètres envoyé pour "register" un utilisateur sont valides 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
/**
 * Valide que le mot de passe courrant correspont au mot de passe actuel et que le nouveau mot de passe est valide.
 * @param {*} req Requête Express (contient les données de l'utilisateur dans req.body)
 * @param {*} res Réponse Express
 * @param {*} next Middleware de gestion des erreurs
 * @returns Retourne l'erreur pour éviter l'exécution du reste de la méthode
 */
export const validatePatch = async (req, res, next) => {
    const {currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword){
        const error = new Error("Mot de passe et nouveau mot de passe sont requis");
        error.statusCode = 400;
        return next(error);
    }
    const infoUser = utils.obtenirInfoToken(req);
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
