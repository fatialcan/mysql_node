const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const router = require('./routes/router')

const app = express()

app.set('views', path.join(__dirname, 'view'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

dotenv.config({ path: './src/env/.env' })

app.use(cookieParser())
app.use('/', router)
app.set('view engine', 'ejs')

app.listen(3000, () => {
  console.log('Servidor activo en puerto 3000')
})
