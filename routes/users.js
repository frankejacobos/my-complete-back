const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express')

const { User, validateUser, validateUserId } = require('../models/user')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')

const router = express.Router()

// DEVUELVE EL USUARIO ACTUAL
router.get('/me', [auth], async function (req, res) {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
})

// AGREGA UN NUEVO USUARIO Y DEVUELVE SU TOKEN
router.post('/', [], async function (req, res) {
  const result = validateUser(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('User already registered.')

  user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateAuthToken(user)
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']))
})

router.put('/:id', [auth, validateObjectId], async function (req, res) {
  const result = validateUser(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  let user = { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold }
  user = await User.findByIdAndUpdate(req.params.id, user, { new: true })
  if (!user) return res.status(404).send('The User with the given ID was not found.')

  const token = generateAuthToken(user)
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})

router.delete('/:id', [auth, admin, validateObjectId], async function (req, res) {
  const user = await User.findByIdAndRemove(req.params.id)
  if (!user) return res.status(404).send('The User with the given ID was not found.')

  res.send(user)
})

router.get('/:id', [validateObjectId], async function (req, res) {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).send('The User with the given ID was not found.')

  const token = generateAuthToken(user)
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})

module.exports = router

