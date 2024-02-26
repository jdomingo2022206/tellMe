import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Public from './public.model';

export const publicationGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, publications] = await Promise.all([
        Public.countDocuments(query),
        Public.find(query)
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
    const publication = await Public.findOne({_id: id});
    
    res.status(200).json({
        publication
    })
}
