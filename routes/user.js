const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserController = require("../controllers/user");
const auth = require("../middlewares/auth");

// Configuraciones de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/");
    },
    filename: (req, file, cb) => {
        cb(null, "avatar"+Date.now()+"-"+file.originalname);
    }
})

const uploads = multer({storage});

// Definir rutas
router.get("/prueba-user", auth.auth, UserController.pruebaUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", auth.auth, UserController.profile);
router.get("/list/:page?", auth.auth, UserController.list);
router.put('/update', auth.auth, UserController.update);
// router.post('/upload', [auth.auth, uploads.single("file0")], UserController.upload);

// Exportar router
module.exports = router;