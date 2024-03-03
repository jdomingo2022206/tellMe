import { Router } from "express";
import { check } from "express-validator";
import { validateCampus } from "../../middlewares/validate-campus.js";
import { haveRole } from "../../middlewares/validate-roles.js";
import { validateJWT } from "../../middlewares/validate-jwt.js";
import { existentEmail,existentUserById,roleValid,existUserByEmail} from "../../middlewares/db-validators.js";
import { editMyProfile,
    userAdminPost,
    userPost,
    userDelete,
    userPut,
    getUserByid,
    userGet,
     } from "./user.controller.js";
const router = Router();

router.get("/", userGet);

router.put('/editMyProfile', editMyProfile);

router.get(
    "/:id",
    [
        validateJWT,
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existentUserById),
        validateCampus
    ], getUserByid);

router.put(
    "/",
    [   
        validateJWT,
        check("_id","El id no es un formato válido de MongoDB").isMongoId(),
        check("_id").custom(existentUserById),
        validateCampus
    ], userPut);

router.delete(
        "/:id",
        [   
            validateJWT,
            check("id","El id no es un formato válido de MongoDB").isMongoId(),
            check("id").custom(existentUserById),
            validateCampus
        ], userDelete);

        
router.post(
    "/", 
    [
        check("name","El nombre es obligatorio").not().isEmpty(),
        check("password","El nombre es obligatorio").not().isEmpty(),
        check("password","El password debe ser mayor a 6 caracteres").isLength({min: 6,}),
        check("mail","Este no es un correo válido").isEmail(),
        check("mail").custom(existentEmail),
        validateCampus,
    ], userPost); 

router.post(
    "/admin", 
    [
        check("name","El nombre es obligatorio").not().isEmpty(),
        check("password","El nombre es obligatorio").not().isEmpty(),
        check("password","El password debe ser mayor a 6 caracteres").isLength({min: 6,}),
        check("mail","Este no es un correo válido").isEmail(),
        check("mail").custom(existentEmail),
        validateCampus,
    ], userAdminPost); 



export default router;