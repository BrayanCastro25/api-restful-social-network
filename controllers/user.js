// Importar dependencias y módulos
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require("path");

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


const update = (req, res) => {
    // Recoger info del usuario a actualizar
    let userIdentity = req.user;
    let userToUpdate = req.body;

    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    User.find({
        $or: [
            { email: userToUpdate.email.toLowerCase() },
            { nick: userToUpdate.nick.toLowerCase() }
        ]
    })
        .then(async (users) => {
            let usserIssets = false;

            users.forEach(user => {
                // El usuario identificado debe ser igual al usuario que se envia en el body
                if(user && user._id != userIdentity.id){
                    usserIssets = true;
                }
            });

            if (usserIssets) {
                return res.status(200).send({
                    status: "success",
                    message: "El usuario ya existe"
                });
            }

            // Cifrar la contraseña
            if(userToUpdate.password){
                pwd = await bcrypt.hash(userToUpdate.password, 10);
                userToUpdate.password = pwd;
                
            }

            // Buscar y actualizar
            // El objeto de opciones new:true permite mostrar la información ya actualizada
            User.findByIdAndUpdate(userIdentity.id, userToUpdate, {new:true})
                .then((userUpdated) => {
                    return res.status(200).send({
                        status: "success",
                        message: "Usuario actualizado",
                        user: userUpdated
                    });
                })
                .catch((error) => {
                    return res.status(400).send({
                        status: "error",
                        message: "Error al actualizar el usuario"
                    });
                });

        })
        .catch((error) => {
            return res.status(400).send({
                status: "error",
                message: "Error al consultar el usuario"
            });
        });
}


const upload = (req, res) => {

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
    User.findByIdAndUpdate(req.user.id, {image: req.file.filename}, {new: true})
        .then((userUpdated) => {
            return res.status(200).json({
                status: "success",
                message: "Archivo subido correctamente a la BBDD",
                user: userUpdated,
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


const avatar = (req, res) => {
    // Sacar el parámetro de la URL
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/avatars/" + file;

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


// Exportar acciones
module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar
}