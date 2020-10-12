const path = require('path')
const http= require('http')
const express = require ('express')
const socketio= require('socket.io')

const port = process.env.PORT

const app= express()
const server= http.createServer(app)
const io= socketio(server)

const publicDirectoryPath= path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', ()=>{
    console.log('New connection')
})

server.listen(port, () => {
    console.log('Server started at port '+ port)
})