import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import InitApp from './index'
import { InitErrorHandlers} from './error_handlers'
const initDB = require('./db')
const port = process.env.PORT

function initExpressApp (knex) {
  const app = express()
  app.use(cors())
  InitApp(app, express, bodyParser.json(), knex)
  InitErrorHandlers(app) // ERROR HANDLING
  return app
}

// ENTRY point

initDB()
  .then(knex => {
    const app = initExpressApp(knex)
    app.listen(port, (err) => {
      if (err) {
        throw err
      }
      console.log(`ents do magic on ${port}`)
    })
  })
  .catch(err => {
    console.error(err)
  })
