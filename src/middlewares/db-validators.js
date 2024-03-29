const User = require('../modules/user/user.model');
const Role = require('../modules/role/role.model');
const Publication = require('../modules/publication/publication.model');
const Comment = require('../modules/comment/comment.model');

export const existentEmail = async (correo = '') => {
    console.log('');
    console.log('--- [NOTES] existentEmail.db-validators');
    try {
        const existMail = await User.findOne({correo});
        if(existMail){
            throw new Error(`El email ${ correo } ya fue registrado`);
        }
    } catch (error) {
        console.log('Error al buscar usuario por correo electrónico:', error);
        //console.error('Error al buscar usuario por correo electrónico:', error);
        //throw error; 
    }
}

export const existentUserById = async ( id = '') => {
    console.log('');
    console.log('--- [NOTES] existentUserById.db-validators');
    try {
        const existUser = await User.findOne({id});
        if(existUser){
            throw new Error(`El usuario con el ${ id } no existe`);
        }
    } catch (error) {
        console.log('Error al buscar usuario por id:', error);
        //console.error('Error al buscar usuario por id:', error);
        //throw error;
    }
}

export const roleValid = async (role='') => {
    console.log('');
    console.log('--- [NOTES] roleValid.db-validators');
    try {
        const existRole = await Role.findOne({role});
        if(!existRole){
            throw new Error(`El role ${ role } no existe en base de datos.` )
        }
    } catch (error) {
        console.log('Error al buscar role:', error);
        //console.error('Error al buscar role:', error);
        //throw error;
    }
}

export const existentPublicationById = async ( id = '') => {
    console.log('');
    console.log('--- [NOTES] existentPublicationById.db-validators');
    try {
        const existPublication = await Publication.findOne({id});
    
        if(existPublication){
            throw new Error(`La publicacion con el ${ id } no existe`);
        }
    } catch (error) {
        console.log('Error al buscar publicacion por id:', error);
        //console.error('Error al buscar publicacion por id:', error);
        //throw error;
    }
}

export const copyExistentPublication = async (name = '', date ='') => {
    console.log('');
    console.log('--- [NOTES] copyExistentPublication.db-validators');
    try {
        const existPublication = await Publication.findOne({name, date});

        if (existPublication) {
            throw new Error(`El curso ${name} ya fue registrado`);
        }
    } catch (error) {
        console.log('Error al buscar publicacion por nombre y fecha:', error);
        //console.error('Error al buscar publicacion por nombre y fecha:', error);
        //throw error;
    }
}

export const existentPublication = async (name = '', date='') => {
    console.log('');
    console.log('--- [NOTES] existentPublication.db-validators');
    try {
        const existPublication = await Publication.findOne({name, date});
        if(!existPublication){
            throw new Error(`La publicacion con el ${ name } y la fecha ${date} no existe en base de datos.` )
        }
    } catch (error) {
        console.log('Error al buscar publicacion por nombre y fecha:', error);
        //console.error('Error al buscar publicacion por nombre y fecha:', error);
        //throw error;
    }
}

export const copyExistentComment = async ( user = '', date='') => {
    console.log('');
    console.log('--- [NOTES] copyExistentCommentById.db-validators');
    try {
        const existComment = await Comment.findOne({user,date});
        if(!existComment){
            throw new Error(`El comentario con el ${ id } no existe`);
        }
    } catch (error) {
        console.log('Error al buscar comentario por usuario y fecha:', error);
        //console.error('Error al buscar comentario por usuario y fecha:', error);
        //throw error;
    }
}

export const existentCommentById = async ( id = '') => {
    console.log('');
    console.log('--- [NOTES] existentCommentById.db-validators');
    try {
        const existComment = await Comment.findOne({id});
        if(!existComment){
            throw new Error(`El comentario con el ${ id } no existe`);
        }
    } catch (error) {
        console.log('Error al buscar comentario por id:', error);
        //console.error('Error al buscar comentario por id:', error);
        //throw error;
    }
}

export const existUserByEmail  = async (correo='') => {
    console.log('');
    console.log('--- [NOTES] existUserByEmail.db-validators');
    try {
        const user = await User.findOne({correo});
        if (user) {
            return {
                id: user._id,
                name: user.name,
                email: user.mail,
                status: user.estado
            };
        } else {
            console.log(`El user ${ correo } no existe en base de datos.` );
            //throw new Error(`El user ${ correo } no existe en base de datos.` );
            return null; 
        }
    } catch (error) {
        console.log('Error al buscar usuario por correo electrónico:', error);
        //console.error('Error al buscar usuario por correo electrónico:', error);
        throw error; 
    }
}


