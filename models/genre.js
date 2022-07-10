const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 }
})

const Genre = mongoose.model('Genre', genreSchema)

function validateGenre(genre) {
  const schema = Joi.object({ name: Joi.string().min(5).max(50).required() })
  return schema.validate(genre)
}

function validateGenreId(id) {
  const schema = Joi.object({
    id: Joi.objectId().required()
  })
  return schema.validate(id)
}

module.exports = { genreSchema, Genre, validateGenre, validateGenreId }