const Sauce = require('../models/Sauce');
const fs = require('fs');
// export de la route pour creer une sauces
// creation const ; sauvegarde de la sauce
exports.createSauce = (req, res, next) => {
    console.log(req.body);
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauce)
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};
// export de la route pour modifier une sauce et ensuite la mettre a jour
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};
// export de la route pour supprimer une sauce , la selectionné et ensuite la supprimé grace a sauce.deleteone
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};
// export de la route pour selectionné une sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};
// export de la route pour avoir toutes les sauces a l'affichage de l'application
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};
// export de la route pour liké et dislike une sauce ensuite selection de la sauce 
// mise en place du switch pour configurer les likes et dislikes et ensuite pouvoir la mettre a jour correctement
exports.likeOneSauce = (req, res, next) => {
    let updatedSauce;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                case -1:
                    sauce.dislikes = sauce.dislikes + 1;
                    sauce.usersDisliked.push(req.body.userId);
                    updatedSauce = {
                        "dislikes": sauce.dislikes,
                        "usersDisliked": sauce.usersDisliked
                    }
                    break;
                case 0:
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== req.body.userId);
                        sauce.dislikes = sauce.dislikes - 1;
                        updatedSauce = {
                            "dislikes": sauce.dislikes,
                            "usersDisliked": sauce.usersDisliked
                        }
                    } else {
                        sauce.usersLiked = sauce.usersLiked.filter(user => user !== req.body.userId);
                        sauce.likes = sauce.likes - 1;
                        updatedSauce = {
                            "likes": sauce.likes,
                            "usersLiked": sauce.usersLiked
                        }
                    }
                    break;
                case 1:
                    sauce.likes = sauce.likes + 1;
                    sauce.usersLiked.push(req.body.userId);
                    updatedSauce = {
                        "likes": sauce.likes,
                        "usersLiked": sauce.usersLiked
                    }
                    break;
                default:
                    return res.status(500).json({ error });
            }

            Sauce.updateOne({ _id: req.params.id }, { $set: updatedSauce })
                .then(() => res.status(200).json({ message: 'Sauce liké !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(() => res.status(400).json({ error: 'Sauce non trouvée !' }));
}