const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  phone: { type: String, required: true, minlength: 5, maxlength: 50 },
  isGold: { type: Boolean, default: false }
})

const Customer = mongoose.model('Customer', customerSchema)

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean()
  })
  return schema.validate(customer)
}

function validateCustomerId(id) {
  const schema = Joi.object({
    id: Joi.objectId().required()
  })
  return schema.validate(id)
}

module.exports = { Customer, validateCustomer, validateCustomerId }