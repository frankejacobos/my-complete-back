const logger = require('../utils/logger')

module.exports = function (err, req, res, next) {
  logger.error(`[middleware/Error]: Something failed. ${err.message}`)
  res.status(500).send('[middleware/Error]: Something failed. ' + err.message)
}