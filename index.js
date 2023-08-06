// Importar dependencias

const {connection} = require("./database/connection");
const express = require('express');
const cors = require('cors');

// Mensaje bienvenida
console.log("API NODE my_social_network iniciada");

// Conexion a DB
connection();

// Crear servidor node
const app = express();
const port = 3900;

// Configurar cors
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar conf rutas
const UserRoutes = require('./routes/user');
const PublicationRoutes = require('./routes/publication');
const FollowRoutes = require('./routes/follow');

app.use('/api/user', UserRoutes);
app.use('/api/publication', PublicationRoutes);
app.use('/api/follow', FollowRoutes);

// Ruta prueba

app.get('/ruta-prueba', (req, res) => {

    return res.status(200).json(
        {
            "id": 2,
            "nombre": "Brayan",
            "web": "brayancastro.com"
        }
    );

})

// Poner servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor node corriendo en el puerto: ", port);
});