import { response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../modules/user/user.model.js';
import { generarteJWT } from '../helpers/generate-jwt.js'; 

export const login = async (req, res) => {
    const { mail, password} = req.body;
    try{
        const user = await User.findOne({ mail: mail });
        if(!user){
            return res.status(400).json({
                msg: 'El correo no está registrado'
            })
        }

        // verificar si el user está activo
        if(!user.estado){
            return res.status(400).json({
                msg: 'El user no existe en la base de datos'
            })
        }
        // verificar que la contraseña sea la correcta
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            })
        }

        const token = await generarteJWT(user.id);

        res.status(200).json({
            msg: 'Login ok',
            user,
            token
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: 'Comuniquese con el admin'
        })
    }
}