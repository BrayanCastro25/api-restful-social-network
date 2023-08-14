// Importar modelo
const Follow = require("../models/follow");
const User = require("../models/user");

// Importar dependencias
const mongoosePagination = require('mongoose-pagination');

// Importar servicio
const followService = require("../services/followService");

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

// Acción listado de usuarios que cualquier usuario esta siguiendo (siguiendo)
const following = (req, res) => {
    // Sacar el id del usuario identificado
    let userId = req.user.id;

    // Comprobar si me llega el id por parametro en url
    if(req.params.id){
        userId = req.params.id;
    }

    // Comprobar si me llega la página (si no la pag 1)
    let page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    // Usuarios por página quiero mostrar
    const itemPerPage = 5;

    // Find a follow, popular datos de los usuarios y paginar
    Follow.find({user: userId})
    .populate("user followed", "-password -role -__v")
    .paginate(page, itemPerPage)
        .then(async (follows) => {

            // Get total followers
            const totalUsers = await Follow.countDocuments({}).exec();

            // Listado de usuarios en común con el usuario identificado
            let followUserIds = followService.followUserIds(req.user.id);

            return res.status(200).json({
                status: "success",
                message: "Listado de usuarios que estoy siguiendo",
                follows,
                total: totalUsers,
                pages: Math.ceil(totalUsers/itemPerPage),
                user_following: (await followUserIds).following,
                user_follow_me: (await followUserIds).followers
            });
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "Error al consultar el listado de seguidores",
                follows,
            });
        });

    
};

// Acción listado de usuarios que siguen a cualquier otro usuario (soy seguido)
const followers = (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Listado de usuarios que me siguen"
    });
}; 


// Exportar acciones
module.exports = {
    pruebaFollow,
    save,
    unfollow,
    following,
    followers
}