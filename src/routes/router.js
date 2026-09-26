const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const usersController = require('../controllers/usersController')
const conexion = require('../database/db')

router.get('/login', (req, res) => {
  res.render('login', {
    alert: false,
    alertTitle: '',
    alertMessage: '',
    alertIcon: '',
    alertShowConfirmButton: false,
    timer: false,
    ruta: ''
  })
})

router.get('/register', (req, res) => {
  res.render('register')
})

// ruta principal (protegida, requiere sesión iniciada)
router.get('/', authController.isAuthenticated, (req, res) => {
  res.render('index', { nombre: req.user.name })
})

// CRUD de usuarios 
router.get('/usuarios', authController.isAuthenticated, usersController.listar)
router.get('/usuarios/agregar', authController.isAuthenticated, usersController.mostrarAgregar)
router.post('/usuarios/agregar', authController.isAuthenticated, usersController.agregar)
router.get('/usuarios/editar/:id', authController.isAuthenticated, usersController.mostrarEditar)
router.post('/usuarios/editar/:id', authController.isAuthenticated, usersController.actualizar)
router.post('/usuarios/eliminar/:id', authController.isAuthenticated, usersController.eliminar)

//rutas para los controladores
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router