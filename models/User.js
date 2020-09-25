const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//creation du schema email et password pour ensuite l'utiliser avec mongoose-unique-validator
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); 
// export du model pour que l'utilisateur ne puisse s'incrire qu'une fois avec son mot de passe
module.exports = mongoose.model('User', userSchema);