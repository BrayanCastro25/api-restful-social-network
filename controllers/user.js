// Importar dependencias y módulos
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-pagination');

// Importar esquema Mongo del usuario
const User = require("../models/user");

// Importar services
const jwt = require("../services/jwt");


// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/user.js",
        user: req.user
    });
}

// Registro de usuarios
const register = (req, res) => {

    // Recoger datos de la petición
    let params = req.body;

    // Comprobar que me llegan bien (+ validacion)
    if (!params.name || !params.nick || !params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Control usuarios duplicados
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() }
        ]
    })
        .then((users) => {
            if (users && users.length >= 1) {
                return res.status(200).send({
                    status: "success",
                    message: "El usuario ya existe"
                });
            }

            // Cifrar la contraseña
            bcrypt.hash(params.password, 10, (error, pwd) => {
                params.password = pwd;

                // Crear objeto de usuario
                let user_to_save = new User(params);

                // Guardar usuario en la DB
                user_to_save.save()
                    .then((userStored) => {

                        // Guardado satisfactoriamente
                        return res.status(200).json({
                            status: "success",
                            message: "Usuario registrado correctamente",
                            user: userStored
                        });

                    })
                    .catch((error) => {

                        return res.status(500).json({
                            status: "error",
                            message: "Error al guardar el usuario",
                            error
                        })

                    });
            });


        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "Error en la consulta de usuarios",
                error
            });
        })

}

// Verificación Login
const login = (req, res) => {

    // Recoger parámetros body
    let params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Buscar en la bbdd si existe
    User.findOne({ email: params.email })
        //.select({"password": 0})
        .then((user) => {

            if(!user){
                return res.status(400).json({
                    status: 'error',
                    message: "No existe el usuario"
                });
            }
            // Comprobar su contraseña
            let pwd = bcrypt.compareSync(params.password, user.password);

            if(!pwd){
                return res.status(400).json({
                    status: "error",
                    message: "No es correcta la contraseña"
                });
            }

            // Conseguir Token
            const token = jwt.createToken(user);

            // Devolver datos del usuario
            return res.status(200).json({
                status: 'success',
                message: "Te has registrado correctamente",
                user: {
                    id: user._id,
                    name: user.name,
                    nick: user.nick,
                },
                token: token
            });
            
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "Error a consultar usuario",
                error
            });
        });

}


const profile = (req, res) => {
    // Recibir el parametro de id de usuario por la url
    const id = req.params.id;

    // Consulta para sacar los datos del usuario
    User.findById(id).select({password: 0, role:0})
        .then((userProfile) => {
            return res.status(200).json({
                status: "success",
                message: "Datos del usuario encontrados correctamente",
                user: userProfile
            });
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe",
                error
            });
        });

}


const list = (req, res) => {

    // Controlar en que página estamos
    let page = 1;
    
    if(req.params.page){
        page = req.params.page;
    }

    page = parseInt(page);

    // Consulta con mongoose paginate
    let itemsPerPage = 2;

    User.find().sort('_id').paginate(page, itemsPerPage)
        .then(async (users) => {
            
            // Get total users
            const totalUsers = await User.countDocuments({}).exec();
            if(!users){
                return res.status(404).json({
                    status: "error",
                    message: "No users avaliable...",
                    error: error
                });
            }

            // Return response
            return res.status(200).json({
                status: 'success',
                users,
                page,
                itemsPerPage,
                total: totalUsers,
                pages: Math.ceil(totalUsers/itemsPerPage)
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "Error",
                error: error,
                message: "Query error..."
            });
        });
}


// Exportar acciones
module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list
}