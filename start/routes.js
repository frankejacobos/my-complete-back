const express = require('express')
const cors = require('cors')

const customersRouter = require('../routes/customers')
const genresRouter = require('../routes/genres')
const moviesRouter = require('../routes/movies')
const rentalsRouter = require('../routes/rentals')
const usersRouter = require('../routes/users')
const authRouter = require('../routes/auth')
const returnsRouter = require('../routes/returns')
const error = require('../middleware/error')

module.exports = function (app) {
  app.use(express.json())
  app.use(cors())
  app.get('/api/', function (req, res) { res.send('Hi everyone.') })
  app.use('/api/genres', genresRouter)
  app.use('/api/customers', customersRouter)
  app.use('/api/movies', moviesRouter)
  app.use('/api/rentals', rentalsRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/returns', returnsRouter)
  app.get('/api/:wrongword', function (req, res) { throw new Error("Wrong parameter") })
  app.use(error)
}

