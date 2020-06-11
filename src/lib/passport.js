const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');


//local.signin es el nombre que le doy a mi autentificación de login 
passport.use('local.signin', new LocalStrategy({
    usernameField:'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username,password,done) =>{
    const rows = await pool.query('SELECT * FROM users WHERE username = ?',[username]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password,user.password);
        if(validPassword){
            done(null,user, req.flash('success','Bienvenido ' + user.username));
        } else {
            done(null, false, req.flash('message','Contraseña Incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message','El usuario ingresado no existe'));
    }
}));


//local.signup es el nombre que le doy a mi autentificación de registro
passport.use('local.signup', new LocalStrategy({
    usernameField : 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username,password,done) => {//Ahora parametrizo lo que va a pasar cuando se autentifique el usuario
    const { fullname } = req.body; 
    const newUser = {
            username:username,//ésta sintaxis es la misma
            password,//Que esta
            fullname
        };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

//Serializar el usuario
passport.serializeUser((user,done) => {
    done(null,user.id);
}); 

//Desserializar usuario
passport.deserializeUser( async (id,done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?',[id]);   
    done(null,rows[0]);
});