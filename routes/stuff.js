const express = require('express');
const router = express.Router();

const stuffControllers = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// mise en place des routes avec authentification obligatoire sur chacune d'entre elles
// petite specifisité pour la route creer et modifier qui auras multer en plus de l'authentification car se sont des modifications visibles
// qui peuvent changé le contenue du dossier images
router.post('/', auth, multer, stuffControllers.createSauce);
router.put('/:id', auth, multer, stuffControllers.modifySauce);
router.delete('/:id', auth, stuffControllers.deleteSauce);
router.get('/:id', auth, stuffControllers.getOneSauce);
router.get('/', auth, stuffControllers.getAllSauce);
router.post('/:id/like', auth, stuffControllers.likeOneSauce);

module.exports = router;