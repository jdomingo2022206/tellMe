import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Comment from './comment.model.js';
import User from '../user/user.model.js';
import { isToken } from "../../helpers/tk-metods.js";
import Publication from "../publication/publication.model.js";

export const commentGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, comments] = await Promise.all([
        Comment.countDocuments(query),
        Comment.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        comments
    });
}

export const getCommentById = async (req, res) => {
    const {id} = req.params;
    const comment = await Comment.findOne({_id: id});
    
    res.status(200).json({
        comment
    })
}

export const myComments = async (req, res) => {
    try {
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        const comments = await Comment.find({userId: user._id});
        res.status(200).json({comments});
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        res.status(500).json({ msg: 'Hubo un error al obtener los comentarios.' });
    }
}

export const createMyComment = async (req, res) => {
    try {
        const {publicationTitle, publicationDate, text} = req.body;
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        const publication = await Publication.findOne({title: publicationTitle, date: publicationDate});
        if (!publication){
            return res.status(400).json({msg: 'La publicacion no existe.'});
        }

        const comment = new Comment({userId: user._id, userName: user.name, publicationId: publication._id, publicationName: publication.title, comment: text});
        await comment.save();
        publication.comments.push(comment._id);
        await publication.save();
        publication.commentsInfo.push(comment.comment);
        await publication.save();
        res.status(200).json({msg: `Publicacion:  ${publication.title} || Comentario: ${comment.comment} .`});
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        res.status(500).json({ msg: 'Hubo un error al crear el comentario.' });
    }
}

export const deleteMyComment = async (req, res) => {
    try {
        const {publicationTitle, commentDate} = req.body;
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        const comment = await Comment.findOne({userId: user._id, publicationName: publicationTitle, date: commentDate});
        if (!comment) {
            return res.status(400).json({ msg: 'El comentario no existe.' });
        }else if (comment.userId.toString() !== user._id.toString()) {
            return res.status(400).json({ msg: `No estas autorizado para eliminar este comentario. Este comentario no te pertenece ${user.name} || ${user.mail}.` });
        } 
        comment.estado = false;
        await comment.save();
        res.status(200).json({ msg: `El comentario ${comment.comment} ha sido eliminado.` });
    } catch (e) {
        console.error('Error al eliminar el comentario:', e);
        res.status(500).json({ msg: 'Hubo un error al eliminar el comentario.' });
    }
}

export const updateMyComment = async (req, res) => {
    try {
        const {publicationTitle, commentDate, ...resto} = req.body;
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        const comment = await Comment.findOne({userId: user._id, publicationName: publicationTitle, date: commentDate});
        if (!comment) {
            return res.status(400).json({ msg: 'El comentario no existe.' });
        }else if (comment.userId.toString() !== user._id.toString()) {
            return res.status(400).json({ msg: `No estas autorizado para editar este comentario. Este comentario no te pertenece ${user.name} || ${user.mail}.` });
        } 
        await Comment.findByIdAndUpdate(comment._id, resto);
        res.status(200).json({ msg: `El comentario ${comment.comment} ha sido actualizado.` });
    } catch (e) {
        console.error('Error al actualizar el comentario:', e);
        res.status(500).json({ msg: 'Hubo un error al actualizar el comentario.' });
    }

}
