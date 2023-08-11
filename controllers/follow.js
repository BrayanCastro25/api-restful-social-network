// Importar modelo
const Follow = require("../models/follow");
const User = require("../models/user");


// Acciones de prueba

const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/follow.js"
    })
}

// Acción de seguir a alguien (follow)
const save = (req, res) => {

    // Conseguir datos por body
    const params = req.body;

    // Sacar id del usuario identificado
    const identity = req.user;

    // Crear objeto con modelo follow
    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed
    });

    // Guardar objeto en BBDD
    userToFollow.save()
        .then((followStored) => {

            return res.status(200).json({
                status: "success",
                user: req.user, 
                follow: followStored
            });

        })
        .catch((error) => {

            return res.status(400).json({
                status: "error",
                message: "No se ha podido seguir al usuario",
            });

        });

}

// Acción de dejar de seguir (unfollow)
const unfollow = (req, res) => {

    // Recoger el id del usuario identificado
    const userId = req.user.id;

    // Recoger el id del usuario que sigo y quiero dejar de seguir
    const followedId = req.params.id;

    // Find de las concidencias
    Follow.find({
        "user": userId,
        "followed": followedId
    }).deleteOne()
        .then((followDeleted) => {
            return res.status(200).json({
                status: "success",
                message: "Follow eliminado correctamente",
                identity: req.user,
                followDeleted
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                message: "Error al realizar unfollow"
            });
        });

};

// Acción listado de usuarios que estoy siguiendo

// Acción listado de usuarios que me siguen

// Exportar acciones
module.exports = {
    pruebaFollow,
    save,
    unfollow
}