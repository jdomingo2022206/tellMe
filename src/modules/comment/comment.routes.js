import { Router } from "express";
import { check } from "express-validator";
import {commentGet,
  getCommentById,
  myComments,
  createMyComment,
  deleteMyComment,
  updateMyComment} from "./comment.controller.js"
import { validateCampus } from "../../middlewares/validate-campus.js";
import { validateJWT } from "../../middlewares/validate-jwt.js";

const router = Router();

router.get("/", commentGet);

router.get(
  "/my",
  [
    validateJWT,
  ],
  myComments
);

router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    validateCampus,
  ],
  getCommentById
);

router.post(
  "/",
  [
    validateJWT,
    check("publicationTitle", "El titulo de la publicacion a comentar es obligatorio").not().isEmpty(),  
    check("publicationDate", "La fecha es obligatoria").not().isEmpty(),
    check("text", "El texto es obligatorio").not().isEmpty(),
    validateCampus,
  ],
  createMyComment
);

router.put(
  "/",
  [
    validateJWT,
    check("publicationTitle", "El titulo de la publicacion a comentar es obligatorio").not().isEmpty(),  
    check("commentDate", "La fecha del comentario es obligatoria").not().isEmpty(),
    check("comment", "El nuevo comentario es obligatorio").not().isEmpty(),
    validateCampus,
  ],
  updateMyComment
);

router.delete(
  "/",
  [
    validateJWT,
    check("publicationTitle", "El titulo de la publicacion es obligatorio").not().isEmpty(),
    check("commentDate","La fecha es obligatoria").not().isEmpty(),
    validateCampus,
  ],
  deleteMyComment
);


export default router;
