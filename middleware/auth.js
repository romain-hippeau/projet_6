const jsonWebToken = require('jsonwebtoken');
//creation du middleware qui protégera les routes sélectionnées et vérifiera que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsonWebToken.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};