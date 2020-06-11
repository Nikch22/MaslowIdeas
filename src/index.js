//Modulos
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const {database} = require('./keys');
/* const colors = require('colors'); */

//Inicializaciones
const app = express();
//LLAMO MI MODULO DE AUTENTICACIÓN
require('./lib/passport');

//Configuraciones o Settings
app.set('port', process.env.PORT || 4000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    //Configura el nombre de las extensiones de los archivos dentro de la carpeta
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
//Con esto hago que utilice la configuración
app.set('view engine','.hbs');


//Middelwares (funciones cada que llegue una petición)
//Morgan nos muestra las peticiones por consola
//y 'dev' es para que muestre un determinado tipo de mensaje por consola
app.use(session({
    secret: 'maslowmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//Variables Globales
app.use((req,res,next) => {
//para que tome la peticio, la respuesta y pueda continuar con el código
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});   


//Rouutes (Rutas)
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));


//Public
app.use(express.static(path.join(__dirname,'public'))); 


//Server Starting
app.listen(app.get('port'),() => {
    console.log(`Server On Port ${app.get('port')}`);
});