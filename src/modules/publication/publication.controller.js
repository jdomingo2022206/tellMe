import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Publication from './publication.model.js';
// import User from '../user/user.model';
import { isToken } from "../../helpers/tk-metods.js";
import Categorie from "../categories/categories.model.js";
import Comment from "../comment/comment.model.js";
import User from "../user/user.model.js";
// import {createCategory} from '../categories/categories.controller.js';

// export const publicationGet = async (req = request, res = response) => {
//     const {limite, desde} = req.query;
//     const query = {estado: true};

//     const [total, publications] = await Promise.all([
//         Publication.countDocuments(query),
//         Publication.find(query)
//         .skip(Number(desde))
//         .limit(Number(limite))
//     ]);

//     res.status(200).json({
//         total,
//         publications
//     });
// }

// export const publicationGet = async (req = request, res = response) => {
//     const { limite, desde } = req.query;
//     const query = { estado: true };

//     const [total, publications] = await Promise.all([
//         Publication.countDocuments(query),
//         Publication.find(query)
//             .select('-_id title userName categorieName text comments commentsInfo date') // Selección de campos
//             .skip(Number(desde))
//             .limit(Number(limite))
//     ]);

//     res.status(200).json({
//         total,
//         publications
//     });
// }

export const publicationGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const [total, publications] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .select('-_id title userName categorieName text commentsInfo date') // Selección de campos
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'userId',
                        model: 'User',
                        select: 'name' // Selecciona el nombre del usuario que comentó
                    }
                })
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        // Mapear los datos de los comentarios para solo incluir el nombre del usuario que comentó
        const mappedPublications = publications.map(publication => ({
            title: publication.title,
            userName: publication.userName,
            categorieName: publication.categorieName,
            text: publication.text,
            usersWhoComment: publication.comments.map(comment => comment.userId.name), // Obtener el nombre del usuario que comentó
            commentsInfo: publication.commentsInfo,
            date: publication.date
        }));

        res.status(200).json({
            total,
            publications: mappedPublications // Devolver las publicaciones mapeadas
        });
    } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        res.status(500).json({ msg: 'Hubo un error al obtener las publicaciones.' });
    }
}





export const getPublicById = async (req, res) => {
    const {id} = req.params;
    const publication = await Publication.findOne({_id: id});
    
    res.status(200).json({
        publication
    })
}

export const createMyPublication = async (req, res) => {
    try {
        const {title, text} = req.body;
        let {categorieName} = req.body;
        categorieName = "#"+categorieName.toLowerCase().replace(/ /g, '');
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        const categorie = await Categorie.findOne({name: categorieName});
        console.log('Hi createMyPublication:', categorieName, categorie)
        if (!categorie){
            return res.status(400).json({msg: 'La categoria no existe.'});
        }
        const publication = new Publication({title, userId: user._id, userName: user.name, categorieName: categorie.name, categorieId: categorie._id, text});
        console.log('Hi createMyPublication:', publication)
        await publication.save();
        res.status(200).json({publication});
    } catch (error) {
        console.error('Error al crear la publicacion:', error);
        res.status(500).json({ msg: 'Hubo un error al crear la publicacion.' });
    }
}

// export const myPublications = async (req, res) => {
//     try {
//         const user = await isToken(req, res);
//         if (!user){
//             return;
//         }
//         const publications = await Publication.find({userId: user._id});
//         res.status(200).json({ publications });
//     } catch (e) {
//         console.error('Error al obtener las publicaciones del usuario:', e);
//         res.status(500).json({ msg: 'Hubo un error al obtener las publicaciones del usuario.' });
//     }

// }

// export const myPublications = async (req, res) => {
//     try {
//         const user = await isToken(req, res);
//         if (!user){
//             return;
//         }
//         const publications = await Publication.find({ userId: user._id })
//             .select('-_id title userName categorieName comments commentsInfo date'); // Excluir el campo _id y seleccionar otros campos
//         res.status(200).json({ publications });
//     } catch (e) {
//         console.error('Error al obtener las publicaciones del usuario:', e);
//         res.status(500).json({ msg: 'Hubo un error al obtener las publicaciones del usuario.' });
//     }
// }

export const myPublications = async (req, res) => {
    try {
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        const publications = await Publication.find({ userId: user._id })
        .select('-_id title userName categorieName text commentsInfo date') // Selección de campos
        .populate({
            path: 'comments',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'name' // Selecciona el nombre del usuario que comentó
            }
        })
    
        // Mapear los datos de las publicaciones para formar la estructura de respuesta deseada
        const mappedPublications = publications.map(publication => ({
            title: publication.title,
            userName: publication.userName,
            categorieName: publication.categorieName,
            text: publication.text,
            usersWhoComment: publication.comments.map(comment => comment.userId.name), // Obtener el nombre del usuario que comentó
            commentsInfo: publication.commentsInfo,
            date: publication.date
        }));

        res.status(200).json({
            publications: mappedPublications // Devolver las publicaciones mapeadas
        });
    } catch (e) {
        console.error('Error al obtener las publicaciones del usuario:', e);
        res.status(500).json({ msg: 'Hubo un error al obtener las publicaciones del usuario.' });
    }
}


export const deleteMyPublication = async (req, res) => {
    try {
        const {title, date} = req.body;
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        const publication = await Publication.findOne({title: title, date: date});
        if (!publication) {
            return res.status(400).json({ msg: 'La publicacion no existe.' });
        }else if (publication.userId.toString() !== user._id.toString()) {
            return res.status(400).json({ msg: `No estas autorizado para eliminar esta publicacion. Esta publicacion no te pertenece ${user.name} || ${user.mail}.` });
        } 
        publication.estado = false;
        await publication.save();
        res.status(200).json({ msg: `La publicacion ${publication.title} ha sido eliminada.` });
    } catch (e) {
        console.error('Error al eliminar la publicacion:', e);
        res.status(500).json({ msg: 'Hubo un error al eliminar la publicacion.' });
    }
}

export const updateMyPublication = async (req, res) => {
    try {
        const {title, date, ...resto} = req.body;
        const user = await isToken(req, res);
        const publication = await Publication.findOne({title: title, date: date});
        if (!publication) {
            return res.status(400).json({ msg: 'La publicacion no existe.' });
        }else if (publication.userId.toString() !== user._id.toString()) {
            return res.status(400).json({ msg: `No estas autorizado para editar esta publicacion. Esta publicacion no te pertenece ${user.name} || ${user.mail}.` });
        } 
        await Publication.findByIdAndUpdate(publication._id, resto);
        res.status(200).json({ msg: `La publicacion ${publication.title} ha sido actualizada.` });
    } catch (e) {
        console.error('Error al actualizar la publicacion:', e);
        res.status(500).json({ msg: 'Hubo un error al actualizar la publicacion.' });
    }

}
