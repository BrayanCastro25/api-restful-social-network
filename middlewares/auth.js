// Importar dependencias
const jwt = require('jwt-simple');
const moment = require('moment');

// Importar clave secreta
const libjwt = require('../services/jwt');
const secret = libjwt.secret;


// Middleware de autecnticación
exports.auth = (req, res, next) => {

    // Comprobar si llega la cabecera de auth
    if(!req.headers.authorization){
        return res.status(403).json({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación"
        });
    }

    // Limpiar el token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    // Decodificar token
    try{

        let payload = jwt.decode(token, secret);

        // Comprobar expiración del token
        if(payload.exp <= moment().unix()){
            return res.status(401).json({
                status: "error",
                message: "Token expirado",
                error
            });
        }

        // Agregar datos de usuario a request
        req.user = payload;

    }catch(error){
        return res.status(404).json({
            status: "error",
            message: "Token invalido",
            error
        });
    }

    

    // Pasar a ejecución de acción
    next();
};

