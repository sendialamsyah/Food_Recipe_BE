const express = require('express')
const Router = express.Router()

const authRouter = require('../routes/authUsers')
const recipe = require('../routes/recipe')

Router
    .use('/user', authRouter)
    .use('/recipe', recipe)

module.exports = Router