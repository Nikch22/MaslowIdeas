const bcrypt = require('bcryptjs');
const helpers = {};

//ENCRIPTA LA CONTRASEÑA
helpers.encryptPassword= async (password) => {
    const salt = await bcrypt.genSalt(10);//genera una hash 
    const hash = await bcrypt.hash(password,salt);
    return hash;
};

//DESENCRIPTA LA CONTRASEÑA
helpers.matchPassword = async (password, savedPassword) => {
    try{
     return await bcrypt.compare(password, savedPassword);
    } catch(e) {
        console.log(e);
    }
};

module.exports = helpers;