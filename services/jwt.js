// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta
const secret = "CLaVE_SECreta_API_SOCial_netWORK345345";

// Crear función para generar Token
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        imagen: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    // Devolver jwt Token decodificado
    return jwt.encode(payload, secret);
}

module.exports = {
    createToken,
    secret  
}

