const express = require('express')

const { Movie, validateMovie, validateMovieId } = require('../models/movie')
const { Genre } = require('../models/genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')


const router = express.Router()

router.get('/', async function (req, res) {
  const movies = await Movie.find().sort('name')
  res.send(movies)
})

router.post('/', [auth], async function (req, res) {
  const result = validateMovie(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  const genre = await Genre.findById(req.body.genreId)
  if (!genre) return res.status(404).send('The Genre with the given ID was not found.')

  let movie = new Movie({
    title: req.body.title, genre: { _id: genre.id, name: genre.name },
    numberInStock: req.body.numberInStock, dailyRentalRate: req.body.dailyRentalRate
  })
  await movie.save()

  res.send(movie)
})

router.put('/:id', [auth, validateObjectId], async function (req, res) {
  const result = validateMovie(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  const genre = await Genre.findById(req.body.genreId)
  if (!genre) return res.status(404).send('The Genre with the given ID was not found.')

  let movie = {
    title: req.body.title, genre: { _id: genre.id, name: genre.name },
    numberInStock: req.body.numberInStock, dailyRentalRate: req.body.dailyRentalRate
  }
  movie = await Movie.findByIdAndUpdate(req.params.id, movie, { new: true })
  if (!movie) return res.status(404).send('The Movie with the given ID was not found.')

  res.send(movie)
})

router.delete('/:id', [auth, admin, validateObjectId], async function (req, res) {
  const movie = await Movie.findByIdAndRemove(req.params.id)
  if (!movie) return res.status(404).send('The Movie with the given ID was not found.')

  res.send(movie)
})

router.get('/:id', [validateObjectId], async function (req, res) {
  const movie = await Movie.findById(req.params.id)
  if (!movie) return res.status(404).send('The Movie with the given ID was not found.')

  res.send(movie)
})

module.exports = router
