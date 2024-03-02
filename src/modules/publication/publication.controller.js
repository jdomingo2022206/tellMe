import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Publication from './publication.model';
import User from '../user/user.model';
import { isToken } from "../../helpers";
import Categorie from "../categorie/categorie.model";
import {createCategory} from '../categories/categories.controller';

export const publicationGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, publications] = await Promise.all([
        Publication.countDocuments(query),
        Publication.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        publications
    });
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
        const categorie = await Categorie.findOne({categorieName});
        if (!categorie){
            return res.status(400).json({msg: 'La categoria no existe.'});
        }
        const publication = new Publication({title, userId: user._id, userName: user.nombre, categorieName: categorie.name, categorieId: categorie._id, text});
        await publication.save();
        res.status(200).json({publication});
    } catch (error) {
        console.error('Error al crear la publicacion:', error);
        res.status(500).json({ msg: 'Hubo un error al crear la publicacion.' });
    }
}

export const myPublications = async (req, res) => {
    try {
        const user = await isToken(req, res);
        const publications = await Publication.find({userId: user._id});
        res.status(200).json({ publications });
    } catch (e) {
        console.error('Error al obtener las publicaciones del usuario:', e);
        res.status(500).json({ msg: 'Hubo un error al obtener las publicaciones del usuario.' });
    }

}

export const deleteMyPublication = async (req, res) => {
    try {
        const {title, date} = req.body;
        const user = await isToken(req, res);
        const publication = await Publication.findOne({title: title, date: date});
        if (!publication) {
            return res.status(400).json({ msg: 'La publicacion no existe.' });
        }else if (publication.userId.toString() !== user._id) {
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
        }else if (publication.userId.toString() !== user._id) {
            return res.status(400).json({ msg: `No estas autorizado para editar esta publicacion. Esta publicacion no te pertenece ${user.name} || ${user.mail}.` });
        } 
        await Publication.findByIdAndUpdate(publication._id, resto);
        res.status(200).json({ msg: `La publicacion ${publication.title} ha sido actualizada.` });
    } catch (e) {
        console.error('Error al actualizar la publicacion:', e);
        res.status(500).json({ msg: 'Hubo un error al actualizar la publicacion.' });
    }

}
