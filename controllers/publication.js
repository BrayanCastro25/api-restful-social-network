// Importar modelo
const Publication = require('../models/publication');


// Acciones de prueba

const pruebaPublication = (req, res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/publication.js"
    })
}

// Guardar publicación

// Sacar una publicación

// Eliminar publicación

// Listar todas las publicaciones

// Listar publicaciones de un usuario

// Subir ficheros

// Devolver archivos multimedia


// Exportar acciones
module.exports = {
    pruebaPublication
}