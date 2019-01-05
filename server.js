const {
  MongoClient,
  ObjectID
} = require('mongodb')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

MongoClient.connect('mongodb://localhost:27017/TodoApp', {
  useNewUrlParser: true
}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to server')
  }
  console.log('Connected to DB')
  const db = client.db('TodoApp')

  app.post('/add-todo', (req, res) => {
    const newTodo = req.body

    db.collection('ToDos')
      .insertOne(newTodo)
      .then((result) => {
        console.log(`ToDo '${req.body.text}' added to toDo list`)
        console.log(JSON.stringify(result.ops[0], undefined, 2))
        res.send(JSON.stringify(result.ops[0], undefined, 2))
      }, (err) => {
        console.log('Unable to save document to ToDos collection')
        console.log(err)
        res.send('Unable to save document to ToDos collection')
      })

  })

  app.get('/getAllTodos', async (req, res) => {

    try {
      const result = await db.collection('ToDos')
        .find({})
        .toArray()

      console.log('Listing all to-dos')
      res.send(result)

    } catch (error) {
      console.log(error)
      res.send(error)
    }

  })

  app.post('/delete-todo', async (req, res) => {
    try {
      await db.collection('ToDos')
        .deleteOne(req.body, (err, result) => {
          if (err) throw err
          console.log(`Deleting to-do: ${JSON.stringify(req.body)}`)
          res.status(200).send()
        })
    } catch (error) {
      console.log(error)
      res.status(400).send()
    }

  })

})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})

// const { MongoClient, ObjectID } = require('mongodb')

// MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
//   if (err) {
//     return console.log('Unable to connect to server')
//   }

//   const db = client.db('TodoApp')

//   db.collection('ToDos')
//     .insertOne({ 
//       text: 'Cook breakfast',
//       completed: false,
//       completedAt: new Date(Date.now())
//     })
//     .then((result) => {
//       console.log(JSON.stringify(result.ops, undefined, 2))
//     },(err) => {
//       console.log('Unable to save document to ToDos collection', err)
//     })

//   client.close()
// })