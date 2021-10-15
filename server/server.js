const io = require('socket.io')(5001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ members, text }) => {
    members.forEach(member => {
      const newRecipients = members.filter(r => r !== member)
      newRecipients.push(id)
      socket.broadcast.to(member).emit('receive-message', {
        members: newRecipients, sender: id, text
      })
    })
  })
})