const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDb server\n', err)
  }
  console.log('Connected to MongoDB server')
  const db = client.db('TodoApp')

  // db.collection('ToDos')
  //   .find({ 
  //     _id: new ObjectID('5c29fd64858b6f3ef8fce622') 
  //   })
  //   .toArray()
  //   .then((docs) => {
  //     console.log('ToDos')
  //     console.log(JSON.stringify(docs, undefined, 2))
  //   }, (err) => {
  //     console.log('Unable to fetch todos', err)
  //   })

  // db.collection('ToDos')
  //   .find()
  //   .count()
  //   .then((count) => {
  //     console.log(`ToDos count:${count}`)
  //   }, (err) => {
  //     console.log('Unable to fetch todos', err)
  //   })

  db.collection('Users')
    .find({ name:'Bruno T' })
    .toArray()
    .then((users) => {
      console.log(JSON.stringify(users, undefined, 2))
    }, (err) => {
      console.log('Unable to fetch users', err)
    })


  client.close()
})