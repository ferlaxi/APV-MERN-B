import express from "express";
const router = express.Router();
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddelware.js";

//Area pública
router.post("/", registrar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.get("/confirmar/:token", confirmar);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

//Area Privada
router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword)

export default router;
