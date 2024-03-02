import { Router } from "express";
import { check } from "express-validator";
import {publicationGet,
  getPublicById,
  createMyPublication,
  myPublications,
  deleteMyPublication,
  updateMyPublication} from "./publication.controller.js"
import { validateCampus } from "../../middlewares/validate-campus.js";
import { haveRole } from "../../middlewares/validate-roles.js";
import { validateJWT } from "../../middlewares/validate-jwt.js";

const router = Router();

router.get("/", publicationGet);

router.get(
  "/my",
  [
    validateJWT,
  ],
  myPublications
);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    validateCampus,
  ],
  getPublicById
);

router.post(
  "/",
  [
    validateJWT,
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("title","El titulo debe ser mayor a 5 caracteres").isLength({min: 5}),  
    check("categorieName", "La categoria es obligatoria").not().isEmpty(),
    check("text", "El texto es obligatorio").not().isEmpty(),
    check("text","El texto debe ser mayor a 15 caracteres").isLength({min: 15}),
    validateCampus,
  ],
  createMyPublication
);

router.put(
  "/",
  [
    validateJWT,
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("date","La fecha es obligatoria").not().isEmpty(),  
    check("text", "El texto es obligatorio").not().isEmpty(),
    check("text","El texto debe ser mayor a 15 caracteres").isLength({min: 15}),
    validateCampus,
  ],
  updateMyPublication
);

router.delete(
  "/",
  [
    validateJWT,
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("date","La fecha es obligatoria").not().isEmpty(),
    validateCampus,
  ],
  deleteMyPublication
);


export default router;
