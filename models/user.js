const config = require('config')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: { type: String, required: true, minlength: 5, maxlength: 255, unique: true },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
  isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
  return token
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.boolean()
  })
  return schema.validate(user)
}
function validateUserId(id) {
  const schema = Joi.object({ id: Joi.objectId().required() })
  return schema.validate(id)
}
function validateUserPath(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  })
  return schema.validate(user)
}

module.exports = { User, validateUser, validateUserId, validateUserPath }