const { MongoClient, ObjectID } = require('mongodb')
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

  app.emit('appStarted')

  app.post('/add-todo', (req, res) => {
    const newTodo = req.body

    
    if (req.body.text === undefined || req.body.text.length === 0) {
      return res.status(400).send('Unable to save todo - Missing \'text\' field')
    } else if (req.body.completed && typeof req.body.completed !== 'boolean') {
      return res.status(400).send('Unable to save todo - Invalid \'completed\' field')
    }
    if (req.body.completed === undefined) {
      newTodo.completed = false
    }
    if (req.body.completedAt === undefined) {
      newTodo.completedAt = null
    }
    
    db.collection('ToDos')
      .insertOne(newTodo)
      .then((result) => {
        // console.log(`ToDo '${req.body.text}' added to toDo list`)
        // console.log(JSON.stringify(result.ops[0], undefined, 2))
        res.status(200).send(result.ops[0])
        // res.send(JSON.stringify(result.ops[0], undefined, 2))
      }, (err) => {
        console.log('Unable to save document to ToDos collection')
        console.log(err)
        res.satus(400).send('Unable to save document to ToDos collection')
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

module.exports = {
  app
}