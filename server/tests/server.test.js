const expect = require('expect')
const request = require('supertest')
const { app } = require('../server')
const { ObjectId } = require('mongodb')

before((done) => {
  app.on('appStarted', () => {
    done()
  })
})

// describe('POST /add-todo', () => {

// it('should create a new todo', (done) => {
//   const text = {
//     text: 'nozes'
//   }

//   request(app)
//     .post('/add-todo')
//     .send(text)
//     .expect(200)
//     .expect((res) => {
//       expect(res.body.text).toBe(text.text)
//     })
//     .end((err, res) => {
//       if (err) done(err)
//       done()
//     })
// })


//   it('should not create to-do with invalid body data', (done) => {
//     request(app)
//       .post('/add-todo')
//       .send({
//         text: 'nozes',
//         completed: 'true'
//       })
//       .expect(400)
//       .end((err, res) => {
//         if (err) done(err)
//         done()
//       })
//   })

// })

// describe('get /list-todos', () => {
//   it('should return all todos in db', (done) => {
//     request(app)
//       .get('/list-todos') 
//       .expect(200)
//       .end((err, res) => {
//         if (err) done(err)
//         console.log(JSON.parse(res.text))
//         done()
//       })
//   })
// })

describe('POST /get-todo', () => {
  it(' should return one todo that matches the query', (done) => {
    request(app)
      .post('/get-todo')
      .send({ _id : ObjectId('5c314eb70e50de1fac2aa625') })
      .expect(200)
      .end((err,res) => {
        if (err) done(err)
        expect(res.body.text).toContain('nozes')
        done()
      })
  })
})

// describe('GET /delete-all', () => {
//   it('should delete all documents in to-dos collection'), (done) => {
//     request(app)
//       .get('/delete-all')
//       .expect(200)
//       .expect((res) => {
//         console.log(res.body.length)
//         expect(res.body.length).toBe(0)
//       })
//       .end(done)
//   }
// })