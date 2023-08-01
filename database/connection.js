const mongoose = require("mongoose");

const connection = async() => {

    try {

        await mongoose.connect('mongodb://localhost:27017/my_social_network');
        console.log("Conexión establecida correctamente a la DB my_social_network");

    } catch (error) {

        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    
    }

}

module.exports = {
    connection  
}
