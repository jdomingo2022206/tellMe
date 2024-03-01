import { Router } from "express";
import { check } from "express-validator";
import { login } from "./auth.controller.js";
import { validateCampus } from "../middlewares/validate-campus.js";

const router = Router();

router.post(
    '/login',
    [
        check('mail', 'Este no es un correo válido').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validateCampus,
    ],
    login
);

export default router;