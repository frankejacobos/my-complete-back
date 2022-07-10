const mongoose = require('mongoose')
const logger = require('../utils/logger')
require('express-async-errors')
const config = require('config')

module.exports = function () {
  const db = config.get('db')
  mongoose.connect(db)
    .then(() => {
      console.log(`Connected to ${db}...`)
      logger.info(`Connected to ${db}...`)
    })
    .catch(() => {
      logger.error(`Could not connect to ${db}...`)
      console.log(`Connected to ${db}...`)
    })
}