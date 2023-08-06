// Importar dependencias y módulos
const bcrypt = require('bcrypt');

// Importar esquema Mongo del usuario
const User = require("../models/user");
const user = require('../models/user');
const { param } = require('../routes/user');


// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/user.js"
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
            const token = false;

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
                message: "Error a consultar usuario"
            });
        });

}


// Exportar acciones
module.exports = {
    pruebaUser,
    register,
    login
}