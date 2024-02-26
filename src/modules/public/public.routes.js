import { Router } from "express";
import { check } from "express-validator";
import {
  usuariosGet,
  usuariosPost,
  getUsuarioById,
  usuariosPut,
  usuariosDelete,
} from "./user.controller.js";
import {
  existenteEmail,
  esRoleValido,
  existeUsuarioById,
} from "../../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../../middlewares/validar-roles.js";
import { validarJWT } from "../../middlewares/validar-jwt.js";

const router = Router();

router.get("/", usuariosGet);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  getUsuarioById
);

export default router;
