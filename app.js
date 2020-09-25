const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/stuff');
//connexion a mongoDB
mongoose.connect('mongodb+srv://rom:hashpassword21.à@projet.om9hc.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); 
// ajout des headers qui vont nous permettre d'accéder a notre api depuis n'importe quelle origine
//d'ajouter les headers mentionnés aux requêtes envoyées vers notre API ;
//d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//ajout des configurations pour la mise en place de express rate limit 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
});
//mise en place de la methode .use afin que l'application puisse utilisées les modules initialisé précédement et spécification de routes
app.use(bodyParser.json());

app.use(limiter);
app.use(xss());
app.use(helmet());
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;