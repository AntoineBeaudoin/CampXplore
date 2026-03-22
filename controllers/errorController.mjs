export const get404 = (req, res) => {
    res.status(404).json({message : "Ressource non trouvee", statusCode : 404});
};

export const getErrors = (err, req, res, next) => {
    if(err.kind === "ObjectId" && err.name === "CastError"){
        err.statusCode = 400;
        err.message = "L'id n'as pas un format valide";
    }

    if(err.name === "ValidationError"){
        err.message = `Erreur de validation : ${err.message}`;
        err.statusCode = 400;
    }

    if(!err.statusCode)
        err.statusCode = 500;

    res.status(err.statusCode).json({
        message: err.message,
        status: err.statusCode,
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
        error: "error"
    });
}