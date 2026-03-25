import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if(!authHeader){
        const error = new Error("Non authentifie");
        error.statusCode = 401;
        return next(error);
    }
    const token = authHeader.split(" ")[1];
    let decodeToken;
    try{
        decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodeToken;
        next();
    }
    catch(err){
        err.statusCode = 401;
        return next(err);
    }
}