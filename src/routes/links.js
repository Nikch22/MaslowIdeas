const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth')
//CUANDO LLEGUE UNA PETICIÓN GET AL SERVIDOR A LA RUTA /ADD
router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

//ENVÍA LOS DATOS DEL FORMULARIO POR MÉTODO POST Y LOS INSERTA EN LA DB
router.post('/add', isLoggedIn, async (req,response) => {
    const { title, url, description } = req.body;
    const newIdea = {
        title,
        url,
        description,
        user_id:req.user.id
    };
    await pool.query('INSERT INTO ideas set ?', [newIdea]);
    req.flash('success', 'Guardaste Tú Idea Exitosamente!');
    response.redirect('/links');
});

//CONSULTA TODAS LAS IDEAS EN DB
router.get('/', isLoggedIn, async (req,res) => {
    const ideas = await pool.query('SELECT * FROM ideas WHERE user_id = ?', [req.user.id]);
    res.render('links/list', {ideas: ideas});
});

//DELETE EN LA RUTA SEGUN EL ID
router.get('/delete/:id', isLoggedIn, async (req,res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM ideas WHERE id = ?', [id]);
    req.flash('success', 'Esa Idea Ya No Existe!');
    res.redirect('/links');
});

//EDIT EN DE UNA IDEA SEGUN ID
router.get('/edit/:id', isLoggedIn, async (req,res) => {
    const { id } = req.params;
    const ideas = await pool.query('SELECT * FROM ideas WHERE id = ?', [id]);
//SÓLO TOMO LOS DATOS DEL OBJ EN POSICIÓN 0
    res.render('links/edit', {idea : ideas[0]});
});

router.post('/edit/:id', isLoggedIn, async (req,res) =>{
    const { id } = req.params;
    const  {title, description, url} = req.body;
    const newIdea = {
        title,
        description,
        url
    };
    await pool.query('UPDATE ideas set ? WHERE id = ?',[newIdea, id]);
    req.flash('success', '¡¡ Actualizaste Tú Idea !!');
    res.redirect('/links');
});

module.exports = router;