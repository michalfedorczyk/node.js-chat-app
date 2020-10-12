const express = require ('express')
require('./db/mongoose')
const userRouter= require('./routers/')

const app= express()

app.use(express.json())
app.use(userRouter)

module.exports({
    app
})