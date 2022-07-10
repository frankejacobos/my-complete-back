const express = require('express')

const { Customer, validateCustomer, validateCustomerId } = require('../models/customer')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')

const router = express.Router()

router.get('/', async function (req, res) {
  const customers = await Customer.find().sort('name')
  res.send(customers)
})

router.post('/', [auth], async function (req, res) {
  const result = validateCustomer(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  let customer = new Customer({ name: req.body.name, phone: req.body.phone, isGold: req.body.isGold })
  customer = await customer.save()

  res.send(customer)
})

router.put('/:id', [auth, validateObjectId], async function (req, res) {
  const result = validateCustomer(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  let customer = { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold }
  customer = await Customer.findByIdAndUpdate(req.params.id, customer, { new: true })
  if (!customer) return res.status(404).send('The Customer with the given ID was not found.')

  res.send(customer)
})

router.delete('/:id', [auth, admin, validateObjectId], async function (req, res) {
  const customer = await Customer.findByIdAndRemove(req.params.id)
  if (!customer) return res.status(404).send('The Customer with the given ID was not found.')

  res.send(customer)
})

router.get('/:id', [auth, validateObjectId], async function (req, res) {
  const customer = await Customer.findById(req.params.id)
  if (!customer) return res.status(404).send('The Customer with the given ID was not found.')

  res.send(customer)
})

module.exports = router
