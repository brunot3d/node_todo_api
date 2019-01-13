const { MongoClient, ObjectID } = require('mongodb')
const express = require('express')
const bodyParser = require('body-parser')
const Joi = require('joi')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

const todoSchema = Joi.object().keys({
  text : Joi.string().required(),
  completed: Joi.boolean().default(false),
  completedAt: Joi.any().default(null),
  createdAt: Joi.date().default(new Date)
})


MongoClient.connect('mongodb://brunot3d:c5d80f05347e3789623cdb10d3b5dbc5@ds255784.mlab.com:55784/brunotdb' || 'mongodb://localhost:27017/TodoApp', {
  useNewUrlParser: true
}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to server')
  }
  const db = client.db('TodoApp')
  
  console.log('Connected to DB')
  app.emit('appStarted')

  app.post('/add-todo', (req, res) => {
    const newTodo = req.body

    Joi.validate(newTodo, todoSchema, (err, result) => {
      if (err) {
        const error = new Error('Invalid Input')

        error.status = 404
        res.status(404).send(error)
      } else {
        db.collection('ToDos')
          .insertOne(result)
          .then((result) => {
            res.status(200).json({ result : result, document : result.ops[0], msg: 'Successfuly inserted to-do', error : null })
          }, (err) => {
            console.log('Unable to save document to ToDos collection')
            console.log(err)
            res.status(400).send('Unable to save document to ToDos collection')
          })
      }
    })

  })

  app.get('/list-todos', async (req, res) => {

    try {
      const result = await db.collection('ToDos')
        .find({})
        .toArray()

      console.log('Listing all to-dos')
      res.send({ length : result.length, results: result } )

    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }

  })

  app.get('/get-todo/:id', (req, res) => {
    const id = req.params.id

    if (!ObjectID.isValid(id)) {
      return res.status(404).send('Invalid to-do Id format')
    }

    db.collection('ToDos')
      .findOne({ _id : ObjectID(id) })
      .then((todo) => {
        if (!todo) {
          return res.status(404).send('No to-do found')
        }
        todo.youSearchedAt = new Date()
        res.json(todo)
      }, (err) => {
        res.status(404).send()
      })
  })

  app.delete('/delete-todo/:id', async (req, res) => {
    try {
      const id = req.params.id

      if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid to-do Id format')
      }

      await db.collection('ToDos')
        .deleteOne({ _id : new ObjectID(id) }, (err, result) => {
          if (err) throw err
          console.log(`Deleting to-do (_id:${JSON.stringify(id)})`)
          if (result.result.n === 0) {
            return res.status(400).send('To-do not found to be deleted')
          }
          res.status(200).send(result.result)
        })
    } catch (err) {
      console.log(err)
      res.status(400).send('Unable to delete todo')
    }
  })

  app.get('/delete-all', (req, res) => {
    db.collection('ToDos')
      .deleteMany({})
      .then((result) => {
        res.send(result)
      }, (err) => {
        res.status(400).send('Unable to clear list of to-dos', err)
      })
  })

  app.get('/get-user/:nickname', (req, res) => {
    const userName = req.body
    const userNickname = req.params

    db.collection('Users')
      .findOne(userNickname)
      .then((user) => {
        if (!user) {
          return res.send('User not found')
        }
        res.json(user)
      }, (err) => {
        res.status(400).send('Unable to find user in db', err)
      })
  })

})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
  
})

module.exports = {
  app
}