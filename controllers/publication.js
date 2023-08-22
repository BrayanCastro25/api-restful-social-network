// Importar modulos
const fs = require('fs');
const path = require('path');

// Importar modelo
const Publication = require('../models/publication');

// Importar servicios
const followService = require("../services/followService");

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
                message: "Publicación eliminada",
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


// Listar publicaciones de un usuario
const user = (req, res) => {
    // Sacar el id del usuario
    let userId = req.params.id;

    // Controlar la página
    let page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    const itemsPerPage = 3;

    // Find, populate, ordenar, paginar
    Publication.find({'user': userId})
        .sort("-created_at")
        .populate("user", "-password -__v -role -email")
        .paginate(page, itemsPerPage)
        .then(async (publicationsUser) => {
            const totalPublications = await Publication.countDocuments({'user': userId}).exec();

            return res.status(200).json({
                status: "success",
                message: "Publicaciones del usuario",
                publications: publicationsUser,
                page,
                totalPublications,
                pages: Math.ceil(totalPublications/itemsPerPage)
            });

        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "Error al consultar las publicaciones del usuario"
            });
        })

};


// Subir ficheros
const upload = (req, res) => {

    // Extraer publicationID
    const publicationId = req.params.id;

    // Recoger el fichero de imagen
    if(!req.file){
        return res.status(404).json({
            status: "error",
            message: "La petición no incluye la imagen"
        });
    }

    // Conseguir el nombre del archivo
    let imageName = req.file.originalname;

    // Extraer la extensión del archivo
    let imageSplit = imageName.split('\.');
    let extension = imageSplit[1];

    // Comprobar extensión
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif"){

        // Borrar archivo que no corresponda a las extensiones
        const filePath = req.file.path;
        const fileDelete = fs.unlinkSync(filePath);
        
        return res.status(400).json({
            status: "error",
            message: "Extensión del fichero invalida"
        });
    }

    // Si es correcta, guardar en BBDD
    Publication.findOneAndUpdate({"user": req.user.id, "_id": publicationId}, {file: req.file.filename}, {new: true})
        .then((publicationUpdated) => {
            return res.status(200).json({
                status: "success",
                message: "Archivo subido correctamente a la BBDD",
                publication: publicationUpdated,
                file: req.file
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                message: "Error al guardar la imagen en la BBDD"
            });
        });

    
}

// Devolver archivos multimedia
const media = (req, res) => {
    // Sacar el parámetro de la URL
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/publications/" + file;

    // Comprobar que existe
    fs.stat(filePath, (error, exists) => {

        if(!exists){
            return res.status(404).json({
                status: "error",
                message: "No existe el archivo"
            });
        }

        console.log(filePath);
        console.log(path.resolve(filePath));
        // Devolver un file con path.resolve() se obtiene la ruta absoluta del archivo
        return res.sendFile(path.resolve(filePath));
    });

}

// Listar todas las publicaciones (FEED)
const feed = async (req, res) => {
    // Sacar la página actual
    let page = 1;
    if(req.params.page){
        page = req.params.page;
    }


    // Establecer número de elementos por página
    let itemsPerPage = 5;

    // Sacar un array de ifenmtificadores de usuarios que yo sigo como usuario logueado
    try{
        const myFollows = await followService.followUserIds(req.user.id);

        const publicationsFollowing = await Publication.find({
            user: {"$in": myFollows.following}
        })
            .populate("user", "-password -role -__v -email")
            .sort("-created_at")
            .paginate(page, itemsPerPage)

        const totalPublications = await Publication.countDocuments({"__v": "0"}).exec();

        return res.status(200).json({
            status: "success",
            message: "Feed de publicaciones",
            myFollowing: myFollows.following,
            publications: publicationsFollowing,
            page,
            itemsPerPage,
            pages: Math.ceil(totalPublications / itemsPerPage),
            totalPublications
        });

         // Find de publicaciones in, (ordenar, popular, paginar)
        
    }
    catch (error) {
        return res.status(400).json({
            status: "error",
            message: "No se han listado las publicaciones del feed"
        });
    }

   

    
};

// Exportar acciones
module.exports = {
    pruebaPublication,
    save,
    detail,
    remove,
    user,
    upload,
    media,
    feed
}