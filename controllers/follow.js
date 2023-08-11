// Importar modelo
const Follow = require("../models/follow");
const User = require("../models/user");


// Acciones de prueba

const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/follow.js"
    })
}

// Acción de seguir a alguiens
const save = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Método dar follow"
    });
}

// Exportar acciones
module.exports = {
    pruebaFollow,
    save
}