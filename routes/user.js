const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user');
//mise en place des routes pour s'inscrire et se connécter avec comme paramétre le fichier user du dossier controllers
router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);


module.exports = router;