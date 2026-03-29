import User from "../CampXplore/models/user.mjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const stringEstValide = (v) => {
    return typeof(v) === "string" && v.trim().length > 0;
};

export const listeDeStringEstValide = (liste) => {
    let esValide = true;
    let i = 0;
    while (esValide && i < liste.length){
        esValide = stringEstValide(liste[i]);
        i++;
    }
    return esValide;
}

export function obtenirInfoToken(req){
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    let decodeToken;
    decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodeToken;
}

export async function esAdmin(req){
    const userToken = obtenirInfoToken(req);
    const user = await User.findOne({email: userToken.email})
    return user?.role === "admin";
}