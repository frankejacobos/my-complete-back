const express = require('express')

const { Genre, validateGenre, validateGenreId } = require('../models/genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')


const router = express.Router()

router.get('/', async function (req, res) {
  const genres = await Genre.find().sort('name')
  res.send(genres)
})

router.post('/', [auth], async function (req, res) {
  const result = validateGenre(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  let genre = new Genre({ name: req.body.name })
  genre = await genre.save()

  res.send(genre)
})

router.put('/:id', [auth, validateObjectId], async function (req, res) {
  const result = validateGenre(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  let genre = { name: req.body.name }
  genre = await Genre.findByIdAndUpdate(req.params.id, genre, { new: true })
  if (!genre) return res.status(404).send('The Genre with the given ID was not found.')

  res.send(genre)
})

router.delete('/:id', [auth, admin, validateObjectId], async function (req, res) {
  const genre = await Genre.findByIdAndRemove(req.params.id)
  if (!genre) return res.status(404).send('The Genre with the given ID was not found.')

  res.send(genre)
})

router.get('/:id', [validateObjectId], async function (req, res) {
  const genre = await Genre.findById(req.params.id)
  if (!genre) return res.status(404).send('The Genre with the given ID was not found.')

  res.send(genre)
})

module.exports = router
