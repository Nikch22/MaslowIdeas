//LLAMA AL MODULO MYSQL
const mysql = require('mysql');
//LLAMA CON DECONSTRUCCIÓN DE UN SÓLO METODO DEL MODULO DE NODEJS 
const {promisify} = require('util');
//ACA SE USA DECONSTRUCCIÓN 
const { database } =  require('./keys');

//CERA LA CONEXIÓN DE TIPO POOL CON LA DB
const pool = mysql.createPool(database);      
//HACE LA CONEXIÓN A LA DB
pool.getConnection((error, connection) => {
    if(error){
        if(error.code === 'PROTOCOL_CONNECTION_LOST'        ){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(error.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
        }
        if(error.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connection) connection.release();   
        console.log('DB IS CONNECTED');
        return;
    
});

//CONVIERTE CODIGO DE CALLBACKS A PROMESAS PARA FUNCIONES QUE NO LO SOPORTAN
//EN ESTE CASO COVIERTE EN PROMESAS (SOPORTA CÓDIGO ASÍNCRONO) LAS CONSULTAS 
pool.query = promisify(pool.query);

//EXPORTA EL MODULO YA CONECTADO
module.exports = pool;