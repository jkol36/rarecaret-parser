import mongoose from 'mongoose'
global.Promise = require('bluebird')
mongoose.Promise = require('bluebird')
require('./models')

if(process.env.NODE_ENV != 'production')
  require('dotenv').load()

const mongooseOptions = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
export const initializeDatabase = () => {
  return mongoose.connect(process.env.DATABASE_URL, mongooseOptions)
  .then(() => {
    let connection = mongoose.connection
    connection.on('error', console.error.bind(console, 'connection error'))
    connection.once('open', Promise.resolve)
  })
}

