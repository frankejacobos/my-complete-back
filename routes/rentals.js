const express = require('express')

const { Rental, validateRental, validateRentalId, removeRental } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')

const router = express.Router()

router.get('/', async function (req, res) {
  const rentals = await Rental.find().sort('-dateOut')
  res.send(rentals)
})

router.post('/', [auth], async function (req, res) {
  const result = validateRental(req.params)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  const customer = await Customer.findById(req.body.customerId)
  if (!customer) return res.status(404).send('The Customer with the given ID was not found.')

  const movie = await Movie.findById(req.body.movieId)
  if (!movie) return res.status(404).send('The Movie with the given ID was not found.')
  if (movie.numberInStock === 0) return res.status(404).send('Movie not in stock.')

  let rental = new Rental({
    customer: { _id: customer._id, name: customer.name, phone: customer.phone, isGold: customer.isGold },
    movie: { _id: movie._id, title: movie.title, dailyRentalRate: movie.dailyRentalRate },
    rentalFee: req.body.rentalFee
  })
  await rental.save((err) => {
    if (err) return res.status(400).send('Rental validation failed...')
  })

  movie.numberInStock--
  await movie.save((err) => {
    if (err) {
      removeRental(rental)
      return res.status(400).send('Movie validation failed. Rental canceled...')
    }
  })

  return res.status(200).send(rental)
})

router.put('/:id', [auth, validateObjectId], async function (req, res) {
  res.status(400).send('Rentals can not be edited.')
})

router.delete('/:id', [auth, admin, validateObjectId], async function (req, res) {
  res.status(400).send('Rentals can not be deleted.')
})

router.get('/:id', [validateObjectId], async function (req, res) {
  const rental = await Rental.findById(req.params.id)
  if (!rental) return res.status(404).send('The Rental with the given ID was not found.')

  res.send(rental)
})

module.exports = router
