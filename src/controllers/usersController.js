const bcrypt = require('bcryptjs')
const conexion = require('../database/db')

// Listar todos los usuarios
exports.listar = (req, res) => {
  conexion.query('SELECT id, name, email, created_at FROM users', (error, results) => {
    if (error) {
      console.log(error)
      return res.send('Error al obtener usuarios')
    }
    res.render('usuarios', { usuarios: results, nombre: req.user.name })
  })
}

// Mostrar formulario para agregar un usuario nuevo
exports.mostrarAgregar = (req, res) => {
  res.render('agregar-usuario', { nombre: req.user.name })
}

// Crear un usuario nuevo desde el panel
exports.agregar = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const passHash = await bcrypt.hash(password, 8)

    conexion.query('INSERT INTO users SET ?', { name, email, password: passHash }, (error) => {
      if (error) {
        console.log(error)
        return res.send('Error al agregar usuario (posiblemente el email ya existe)')
      }
      res.redirect('/usuarios')
    })
  } catch (error) {
    console.log(error)
    res.send('Error al agregar usuario')
  }
}

// Mostrar formulario de edición de un usuario
exports.mostrarEditar = (req, res) => {
  const id = req.params.id
  conexion.query('SELECT id, name, email FROM users WHERE id = ?', [id], (error, results) => {
    if (error || results.length === 0) {
      return res.redirect('/usuarios')
    }
    res.render('editar-usuario', { usuario: results[0], nombre: req.user.name })
  })
}

// Actualizar nombre y (opcionalmente) contraseña de un usuario
exports.actualizar = async (req, res) => {
  const id = req.params.id
  const { name, password } = req.body

  try {
    const datos = { name }

    if (password && password.trim() !== '') {
      datos.password = await bcrypt.hash(password, 8)
    }

    conexion.query('UPDATE users SET ? WHERE id = ?', [datos, id], (error) => {
      if (error) {
        console.log(error)
        return res.send('Error al actualizar usuario')
      }
      res.redirect('/usuarios')
    })
  } catch (error) {
    console.log(error)
    res.send('Error al actualizar usuario')
  }
}

// Eliminar un usuario
exports.eliminar = (req, res) => {
  const id = req.params.id
  conexion.query('DELETE FROM users WHERE id = ?', [id], (error) => {
    if (error) {
      console.log(error)
      return res.send('Error al eliminar usuario')
    }
    res.redirect('/usuarios')
  })
}