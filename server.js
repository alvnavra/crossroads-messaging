const { info } = require('console');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
    cors:{
        origins:['172.104.152.232:8080']
    }
})
app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket)=>{
    console.log('a user connected')
    socket.on('my message', (msg)=>{
      console.log(`message: ${msg}`)
      io.emit('my broadcast', `server: ${msg}`);
    })
    socket.on('disconnect', ()=>{
        console.log('a user disconected')
    })
})

http.listen(3000, () => {
  console.log('listening on *:3000');
});