import { response, request } from "express";
import Categorie from "./categories.model.js";
import { isToken } from "../../helpers/tk-metods.js";

export const categoriesGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, categories] = await Promise.all([
        Categorie.countDocuments(query),
        Categorie.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        categories
    });
}

export const getCategoryById = async (req, res) => {
    const {id} = req.params;
    const category = await Categorie.findOne({_id: id});

    if (!category){
        return res.status(400).json({msg: 'La categoria no existe.'});
    }else if(category.estado === false){
        return res.status(400).json({msg: 'La categoria no esta disponible actualmente.'});
    }

    res.status(200).json({
        category
    })
}

export const createCategory = async (req, res) => {
    console.log('');
    console.log('createCategory.categories');
    try {
        let {name} = req.body;
        const {desc} = req.body;
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        name = "#"+name.toLowerCase().replace(/ /g, '');
        const existCategorie = await Categorie.findOne({name})
        if (existCategorie){
            return res.status(400).json({msg: 'La categoria ya existe.'});
        }
        const category = new Categorie({name, desc});
        await category.save();
        res.status(200).json({category});
    } catch (error) {
        console.error('Error al crear la categoria:', error);
        res.status(500).json({ msg: 'Hubo un error al crear la categoria.' });
    }
}

export const deleteCategory = async (req, res) => {
    console.log('');
    console.log('deleteCategory.categories');
    try {
        let {name} = req.body;
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        if (user.role !== 'ADMIN_ROLE'){
            return res.status(400).json({msg: 'No tienes permisos para eliminar categorias.'});
        }
        name = "#"+name.toLowerCase().replace(/ /g, '');
        const existCategorie = await Categorie.findOne({name})
        if (!existCategorie){
            return res.status(400).json({msg: 'La categoria no existe.'});
        }
        await Categorie.findOneAndUpdate({name}, {estado: false});
        res.status(200).json({msg: 'Categoria eliminada.'});
    } catch (error) {
        console.error('Error al eliminar la categoria:', error);
        res.status(500).json({ msg: 'Hubo un error al eliminar la categoria.' });        
    }
}
