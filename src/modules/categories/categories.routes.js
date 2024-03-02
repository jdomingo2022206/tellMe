import { Router } from "express";
import { check } from "express-validator";
import {categoriesGet,getCategoryById,createCategory,deleteCategory} from "../categories/categories.controller.js"
import { validateCampus } from "../../middlewares/validate-campus.js";
import { validateJWT } from "../../middlewares/validate-jwt.js";


const router = Router();

router.get("/", categoriesGet);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    validateCampus,
  ],
  getCategoryById
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("name", "El nombre debe ser mayor a 3 caracteres").isLength({
      min: 3,
    }),
    check("desc", "La descripción es obligatoria").not().isEmpty(),
    check("desc", "La descripción debe ser mayor a 15 caracteres").isLength({
      min: 15,
    }),
    validateCampus,
  ],
  createCategory
);

router.delete(
  "/",
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateCampus,
  ],
  deleteCategory
);


export default router;
