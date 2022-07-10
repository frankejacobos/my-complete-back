const express = require('express')

const app = express()

require('./start/routes')(app)
require('./start/db')()
require('./start/config')()
require('./start/prod')(app)

module.exports = app
