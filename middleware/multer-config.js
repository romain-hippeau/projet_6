const multer = require('multer');
//configuration de multer afin de pouvoir ajouter nos images entrantes;
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
// mise en place de la const storage qui auras pour parametre la destination du fichier
// filename remplace les espaces par des underscores et ajoute un timestamp Date.now() comme nom de fichier.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});
    // export de multer nous mettons comme parametre notre const storage et 
     // lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.
  
module.exports = multer({ storage: storage }).single('image');