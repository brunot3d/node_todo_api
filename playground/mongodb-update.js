const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB', err)
  }
  console.log('Connected to MongoDB server')
  const db = client.db('TodoApp')
  
  // FindOneAndUpdate
  // db.collection('ToDos')
  //   .findOneAndUpdate(
  //     { _id             : new ObjectID('5c2a16e466db4350d0944f93') }, 
  //     { $set            : { completed : true } },
  //     { returnOriginal  : false } 
  //   )
  //   .then((result) => {
  //     console.log(result)
  //   }, (err) => {
  //     console.log('Error to udate document', err)
  //   })

  // Update user name and increment age
  db.collection('Users')
    .findOneAndUpdate(
      { _id             : new ObjectID('5c2a00eb5c628b0bc0d2bfa7') },
      { 
        $set            : { name : 'Jorge' },
        $inc            : { age  : 1 } 
      },
      { returnOriginal  : false }
    )
    .then((result) => {
      console.log(result)
    }, (err) => {
      console.log('Error to udate document', err)
    })


  client.close()
})