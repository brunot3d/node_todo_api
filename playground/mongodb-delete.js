const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('Unable to connect do MongoDB')
  }
  console.log('Connected to MongoDB server')
  const db = client.db('TodoApp')

  // DeleteMany
  // db.collection('ToDos')
  //   .deleteMany({ 
  //     text: 'Eat lunch' 
  //   })
  //   .then((result) => {
  //     console.log(result)
  //   }, (err) => {
  //     console.log('Unable to delete document', err)
  //   })

  // DeleteOne
  // db.collection('ToDos')
  //   .deleteOne({ 
  //     text: 'Walk the dog' 
  //   })
  //   .then((result) => {
  //     console.log(result)
  //   }, (err) => {
  //     console.log('Unable to delete document', err)
  //   })

  // FindOneAndDelete
  // db.collection('ToDos')
  //   .findOneAndDelete({
  //     completed: false
  //   })
  //   .then((result) => {
  //     console.log(result)
  //   }, (err) => {
  //     console.log('Error: ', err)
  //   })

  //DeleteMany - Should delete 5 docs
  db.collection('Users')
    .deleteMany({
      $or:
      [
        {
          name: 'Bruno T'
        }, { 
          _id: new ObjectID('5c2a0519c48e03028e2285fa') 
        } 
      ]
    })
    .then((result) => {
      console.log(JSON.stringify(result, undefined, 2))
    }, (err) => {
      console.log('Unable to delete docs', err)
    })


  client.close()
})