const { info } = require('console');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
    cors:{
        origins:['172.104.152.232:8080']
    }
})

var answers = {}

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket)=>{
    info('a user connected')
    socket.on('my message', (msg)=>{
      console.log(`message: ${msg}`)
      io.emit('my broadcast', `server: ${msg}`);
    })
    socket.on('disconnect', ()=>{
        console.log('a user disconected')
    })
    socket.on('reset', ()=>{
      answers = {}
      io.emit('reset-answers', answers)
    })
    socket.on('player_answer',(answer) => {
      let resp = {id_question:answer.id_question, answer:answer.answwer}
      console.log(answer)
      console.log(answer.nickname)
      console.log(answers)
      if (answer.nickname in answers)
      {
        //Si el usuario existe, tenemos que ver si estamos
        //insertando o modificando una respuesta.
        
        function devolver_idx(p_answer)
        {
          i = 0
          console.table({'p_answer':p_answer})          
          console.log(answers[answer.nickname].length)
          console.log(answers[answer.nickname])
          while(i < answers[answer.nickname].length)
          {
            if (answers[answer.nickname][i]['id_question']==p_answer.id_question) 
            {
              return i
            }
            i++
          }
          return -1
          
        }

        let idx=devolver_idx(answer)        
        if (idx >= 0) 
        {
            
            answers[answer.nickname][idx] = resp
        }
        else answers[answer.nickname].push(resp)
        console.log(answers)
      }
      else {
        answers[answer.nickname] = [resp]
        console.log(answers)
      }
      socket.emit('broadcast_answers',answers)
    })
})

http.listen(3000, () => {
  console.log('listening on *:3000');
});