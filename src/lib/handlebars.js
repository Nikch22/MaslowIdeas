//AQUI SE ESPECIFICA COMO VAN A COMPPORTARSE LAS BIBLIOTECAS
const {format} = require('timeago.js');

const herlpers ={};

herlpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = herlpers;