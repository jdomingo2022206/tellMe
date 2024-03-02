'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import userRoutes from '../src/modules/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import categoriesRoutes from '../src/modules/categories/categories.routes.js';
import publicationRoutes from '../src/modules/publication/publication.routes.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/tellMe/v1/user';
        this.authPath = '/tellMe/v1/auth';
        this.publicationPath = '/tellMe/v1/publication';
        this.commentPath = '/tellMe/v1/comment';
        this.categoriePath = '/tellMe/v1/categorie';

        this.middlewares();  // Configura los middleware de la aplicación
        this.conectarDB();  // Establece la conexión a la base de datos
        this.routes();  // Configura las rutas de la aplicación
    }

    // Conecta a la base de datos MongoDB
    async conectarDB() {
        await dbConnection();
    }

    // Configura los middleware de la aplicación
    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    // Configura las rutas de la aplicación
    routes() {
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.publicationPath, publicationRoutes);
        // this.app.use(this.commentPath, commentRoutes);
        this.app.use(this.categoriePath, categoriesRoutes);
    }

    // Inicia el servidor y escucha en el puerto especificado
    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;