const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const {isToken} = require('../helpers/tk-methods');
const User = require('../models/user');

export const userGet = async (req, res = response ) => {
    console.log('');
    console.log('--- [NOTES] userGet.user')
    try {
        const { limite, desde } = req.query;
        const query = { estado: true};

        const [total, usuarios] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            usuarios
        });
    } catch (e) {
        console.log('Hubo un error al obtener usuarios.');
        // res.status(500).json({ msg: 'Hubo un error al obtener usuarios.' });
        // throw new Error(e);
    }
} 

export const getUserByid = async (req, res) => {
    console.log('');
    console.log('--- [NOTES] getUserById.user')
    try {
        const { id } = req.params;
        const user = await User.findOne({_id: id});
        res.status(200).json({
            user
        });
    } catch (e) {
        console.log('Hubo un error al obtener el usuario por id.');
        // res.status(500).json({ msg: 'Hubo un error al obtener el usuario por id.' });
        // throw new Error(e);
    }
}

export const userPut = async (req, res) => {
    console.log('');
    console.log('--- [NOTES] userPut.user')
    try {
        const { id } = req.params;
        const { _id, google, mail, ...resto} = req.body;

        await User.findByIdAndUpdate(id, resto);

        const user = await User.findOne({_id: id});

        res.status(200).json({
            msg: 'Usuario Actualizado exitosamente',
            user
        })
    } catch (e) {
        console.log('Hubo un error al actualizar usuario.');
        // res.status(500).json({ msg: 'Hubo un error al actualizar usuario.' });
        // throw new Error(e);
    }
}

export const userDelete = async (req, res) => {
    console.log('');
    console.log('--- [NOTES] userDelete.user')
    try {
        const {id} = req.params;
        await User.findByIdAndUpdate(id,{estado: false});

        const user = await User.findOne({_id: id});

        res.status(200).json({
            msg: 'Usuario eliminado exitosamente',
            user
        });
    } catch (e) {
        console.log('Hubo un error al eliminar usuario.');
        // res.status(500).json({ msg: 'Hubo un error al eliminar usuario.' });
        // throw new Error(e);
    }
}

const userPost = async (req, res) =>{
    console.log('');
    console.log('--- [NOTES] userPost.user')
    try {
        const { name, mail, password} = req.body;
        const role = "USER_ROLE"
        const user = new User({name, mail, password, role});

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        await user.save();
        res.status(200).json({
            user
        });
    } catch (e) {
        console.log('Hubo un error al agregar usuario.');
        // res.status(500).json({ msg: 'Hubo un error al agregar usuario.' });
        // throw new Error(e);
    }
}

const userAdminPost = async (req, res) =>{
    console.log('');
    console.log('--- [NOTES] userAdminPost.user')
    try {
        const { name, mail, password} = req.body;
        const role = "ADMIN_ROLE"
        const user = new User({name, mail, password, role});

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        await user.save();
        res.status(200).json({
            user
        });
    } catch (e) {
        console.log('Hubo un error al agregar admin.');
        // res.status(500).json({ msg: 'Hubo un error al agregar usuario.' });
        // throw new Error(e);
    }
}

const editMyProfile = async (req, res) => {
    console.log('');
    console.log('--- [NOTES] editMyProfile.user')
    try { 
        const user = await isToken(req, res);
        const { _id, mail,role,  ...resto} = req.body;
        await User.findByIdAndUpdate(user._id, resto);
        const usuario = await User.findOne({_id: user.id});

        res.status(200).json({ msg: "Tu perfil se a actualizado exitosamente: ", usuario})
        
        
    }catch (e) {
        console.log('Hubo un error al editar el perfil.');
        // res.status(500).json({ msg: 'Hubo un error al editar el perfil.' });
        // throw new Error(e);
    }
}


