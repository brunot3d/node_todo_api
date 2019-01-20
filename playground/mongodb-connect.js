const { MongoClient, ObjectID } = require('mongodb')

const obj = new ObjectID

console.log('new ObjectID', obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true },  (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }

  console.log('Connected to MongoDB server')
  const db = client.db('TodoApp')

  // db.collection('ToDos').insertOne({
  //   text: 'Walk the dog',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err) 
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  // db.collection('Users').insertOne({
  //   name:     'Bruno T',
  //   age:      33,
  //   location: 'Philadelphia'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert user:', err)
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
  // })

  client.close()

})