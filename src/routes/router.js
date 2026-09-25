const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
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

//rutas para los controladores
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router