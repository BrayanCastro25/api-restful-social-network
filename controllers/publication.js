// Importar modelo
const Publication = require('../models/publication');


// Acciones de prueba

const pruebaPublication = (req, res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/publication.js"
    })
}

// Guardar publicación
const save = (req, res) => {
    // Recoger datos del body
    const params = req.body;

    // Si no me llegan dar respuesta negativa
    if(!params.text){
        return res.status(400)-json({
            status: "error",
            message: "debes enviar el texto de la publicación"
        });
    }

    // Crear y rellenar el modelo del objeto
    let newPublication =  new Publication(params);
    newPublication.user = req.user.id;

    // Guardar objeto en bbdd
    newPublication.save()
        .then((publicationStored) => {

            return res.status(200).json({
                status: "success",
                message: "save a publication",
                publicationStored
            });

        })
        .catch((error) => {

            return res.status(400).json({
                status: "error",
                message: "No se ha guardado la publicación"
            });

        });

    
};

// Sacar una publicación
const detail = (req, res) => {
    // Sacar id publibación de URL
    const idPublication = req.params.id;

    // Find con la condición del id
    Publication.findById(idPublication)
        .then((publicationStored) => {
            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                messagge: "Mostrar publicación",
                publication: publicationStored
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                messagge: "Error al consultar publicación"
            });
        });

    
};

// Eliminar publicación
const remove = (req, res) => {
    // Sacar el id de la publicación a eliminar
    const idPublication = req.params.id;

    // Find y luego un remove
    Publication.find({
        'user': req.user.id, 
        "_id": idPublication
    }).deleteOne()
        .then((publicationDeleted) => {
            return res.status(200).json({
                status: "success",
                message: "Eliminar publicación",
                publicationDeleted
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "Error al eliminar publicación"
            });
        });

}

// Listar todas las publicaciones

// Listar publicaciones de un usuario

// Subir ficheros

// Devolver archivos multimedia


// Exportar acciones
module.exports = {
    pruebaPublication,
    save,
    detail,
    remove
}