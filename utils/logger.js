const config = require('config')
const { createLogger, format, transports } = require('winston');

// Import mongodb
require('winston-mongodb')

module.exports = createLogger({
  transports: [
    // File transport
    new transports.File({
      filename: 'logs/messages.log',
      handleExceptions: true,
      handleRejections: true,
      format: format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.align(),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
      )
    }),
    // MongoDB transport
    // new transports.MongoDB({
    //   level: 'error',
    //   handleExceptions: true,
    //   handleRejections: true,
    //   //mongo database connection link
    //   db: config.get('db'),
    //   options: {
    //     useUnifiedTopology: true
    //   },
    //   // A collection to save json formatted logs
    //   collection: 'server_logs',
    //   format: format.combine(
    //     format.timestamp(),
    //     // Convert logs to a json format
    //     format.json())
    // })
  ],
  exitOnError: true,
});