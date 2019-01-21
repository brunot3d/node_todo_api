require('../config/config')

const { MongoClient, ObjectID } = require('mongodb')
const express = require('express')
const bodyParser = require('body-parser')
const Joi = require('joi')

Joi.objectId = require('joi-objectid')(Joi)

const _ = require('lodash')
const app = express()
const port = process.env.PORT

console.log('port', port)
console.log('process', process.env.PORT)

app.use(bodyParser.json())

const todoSchema = Joi.object().keys({
  _id: Joi.objectId(),
  text : Joi.string().required(),
  completed: Joi.boolean().default(false),
  completedAt: Joi.any().default(null),
  createdAt: Joi.date().default(new Date)
})

//  'mongodb://brunot3d:c5d80f05347e3789623cdb10d3b5dbc5@ds255784.mlab.com:55784/brunotdb'
//  'mongodbbrunot:c965492a50b519451be98427ea60397b@ds255784.mlab.com:55784/brunotdb'
//  'mongodb://localhost:27017'

MongoClient.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to server')
  }
  const db = client.db()
  
  console.log('Connected to DB')
  app.emit('appStarted')

  app.post('/add-todo', (req, res) => {
    const newTodo = req.body

    console.log(newTodo)
    
    Joi.validate(newTodo, todoSchema, (err, result) => {
      if (err) {
        const error = new Error('Invalid Input')

        error.status = 404
        res.status(404).send(error)
      } else {
        if (result._id) {
          result._id = new ObjectID(result._id)
        }
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

  app.patch('/todos/:id', (req, res) => {
    const id = req.params.id
    const body = _.pick(req.body, [ 'text', 'completed' ])

    if (!ObjectID.isValid(id)) {
      return res.status(404).send('Invalid to-do Id format')
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime()
    } else {
      body.completed = false
      body.completedAt = null
    }
    db.collection('ToDos')
      .findOneAndUpdate(
        { _id : ObjectID(id) }, 
        { $set: body },
        { returnOriginal:false })
      .then((doc) => {
        if (!doc) return res.status(404).send('Unable to find todo')
        res.send({ doc })
      })
      .catch((err) => {
        if (err) return res.status(400).send('Unable to update todo')
      })
  })

})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

module.exports = {
  app
}