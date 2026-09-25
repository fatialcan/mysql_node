const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')

//procedimiento para registrar un usuario
exports.register = async (req, res) => {
  try {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    console.log(name + "-" + email + "-" + password)
    let passHash = await bcrypt.hash(password, 8)

    conexion.query('INSERT INTO users SET ?', { name: name, email: email, password: passHash }, (error, results) => {
      if (error) {
        console.log('ERROR AL INSERTAR:', error)
        return res.send('Error: ' + error.message)
      }
      console.log('Insertado correctamente, id:', results.insertId)
      res.redirect('/')
    })
  } catch (error) {
    console.log(error)
  }
}

exports.login = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
      res.render('login', {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un correo y contraseña",
        alertIcon: 'info',
        alertShowConfirmButton: true,
        timer: false,
        ruta: 'login'
      })
    } else {
      conexion.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error || results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
          res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o contraseña incorrectos",
            alertIcon: 'error',
            alertShowConfirmButton: true,
            timer: false,
            ruta: 'login'
          })
        } else {
          const id = results[0].id
          const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA
          })
          console.log("TOKEN: " + token + " para el usuario: " + email)

          const cookiesOptions = {
            expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000),
            httpOnly: true
          }

          res.cookie('jwt', token, cookiesOptions)
          res.redirect('/')
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// autenticacion del usuario para acceder a las rutas privadas
exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
      conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
        if (error || !results || results.length === 0) {
          return res.redirect('/login')
        }
        req.user = results[0]
        return next()
      })
    } catch (error) {
      console.log(error)
      return res.redirect('/login')
    }
  } else {
    res.redirect('/login')
  }
}

// cerrar sesion del usuario
exports.logout = (req, res) => {
  res.clearCookie('jwt')
  return res.redirect('/login')
}



