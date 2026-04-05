import User from "../CampXplore/models/user.mjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Vérifie si la string passé en paramêtre est valide
 * @param {*} v La string passé en paramêtre
 * @returns Booléen indiquant si la string est valide
 */
export const stringEstValide = (v) => {
    return typeof(v) === "string" && v.trim().length > 0;
};

/**
 * Valide si une liste de string est valide en faisant appel à stringEstValide
 * @param {*} liste Liste de string à valider
 * @returns Booléen indiquant si la liste de strings est valide
 */
export const listeDeStringEstValide = (liste) => {
    let esValide = true;
    let i = 0;
    while (esValide && i < liste.length){
        esValide = stringEstValide(liste[i]);
        i++;
    }
    return esValide;
}

/**
 * Retourne le token d'autorisation une fois qu'il est décodé
 * @param {*} req Requête Express (contient le token d'authorization dans le req.body)
 * @returns Le token d'autorisation décodé
 */
export function obtenirInfoToken(req){
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    let decodeToken;
    decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodeToken;
}

/**
 * Valide si l'utilisateur authentifié est un administrateur
 * @param {*} req Requête Express (contient le token d'authorization dans le req.body)
 * @returns Booléen indiquant si l'utilisateur connecté est un administrateur
 */
export async function esAdmin(req){
    const userToken = obtenirInfoToken(req);
    const user = await User.findOne({email: userToken.email})
    return user?.role === "admin";
}