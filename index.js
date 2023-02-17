//Create our express and socket.io servers
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4: uuidV4} = require('uuid')

app.set('view engine', 'ejs') // Tell Express we are using EJS
app.use(express.static('public')) // Tell express to pull the client script from the public folder
let NewId = uuidV4();
console.log(NewId,'NewId')
// If they join the base link, generate a random UUID and send them to a new room with said UUID
app.get('/', (req, res) => {
    res.render(`home`,{NewId})
})
// If they join a specific room, then render that room
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})
app.get('/', (req, res) => {
    res.render(`home`,{NewId})
})
// When someone connects to the server
io.on('connection', socket => {
    // When someone attempts to join the room
    socket.on('join-room', (roomId, userId) => {
        console.log('Socket Connected')
        socket.join(roomId)  // Join the room
        socket.broadcast.emit('user-connected', userId) // Tell everyone else in the room that we joined
        
        socket.broadcast.emit('call-end', userId)
        // Communicate the disconnection
        socket.on('disconnect', () => {
            console.log('Socket Disconnected ')
            socket.broadcast.emit('user-disconnected', userId)
        })
    })
    
})
let port = 3002;
server.listen(port,()=>{
    console.log('Server Running On Port No =',port)
}) // Run the server on the 3000 port