const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User, validateUserPath, generateAuthToken } = require('../models/user')
const express = require('express')

const router = express.Router()

// DEVUELVE EL TOKEN DE UN USUARIO - INICIAR SESION
router.post('/', async function (req, res) {
  const result = validateUserPath(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Invalid email.')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid password.')
  
  const token = generateAuthToken(user)
  res.send(token)
})

module.exports = router
