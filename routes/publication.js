const express = require("express");
const router = express.Router();
const multer = require("multer");   
const PublicationController = require("../controllers/publication");
const check = require('../middlewares/auth');

// Configuraciones de subida
const storage = multer.diskStorage({
    // Define la ruta de subida de los archivos
    destination: (req, file, cb) => {
        cb(null, "./uploads/publications/");
    },
    // Define el nombre al archivo
    filename: (req, file, cb) => {
        cb(null, "pub"+Date.now()+"-"+file.originalname);
    }
})

const uploads = multer({storage});

// Definir rutas
router.get("/prueba-publication", PublicationController.pruebaPublication);
router.post('/save', check.auth, PublicationController.save);
router.get('/detail/:id', check.auth, PublicationController.detail);
router.delete('/remove/:id', check.auth, PublicationController.remove);
router.get('/user/:id/:page?', check.auth, PublicationController.user);
router.post("/upload/:id", [check.auth, uploads.single("file0")], PublicationController.upload);

// Exportar router
module.exports = router;