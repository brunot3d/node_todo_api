const expect = require('expect')
const request = require('supertest')
const { app } = require('../server')
const { ObjectID } = require('mongodb')

let todos = [ {
  _id : new ObjectID('5c314ea0b426691f8511f7e9'),
  text : 'nozes primerão'
}, {
  _id : new ObjectID(),
  text :  'from tests 2'
} ]


before((done) => {
  app.on('appStarted', () => {
    done()
  })
})

describe('POST /add-todo', () => {
  it('should create a new todo', (done) => {
    const text = {
      text : 'from tests'
    }

    request(app)
      .post('/add-todo')
      .send(text)
      .expect(200)
      .expect((res) => {
        console.log(res.body.document.text)
        expect(res.body.document.text).toBe(text.text)
      })
      .end((err, res) => {
        if (err) {
          done(err)
        }
        done()
      })
  })
  it('should not create to-do with invalid body data', (done) => {
    request(app)
      .post('/add-todo')
      .send({
        tex : 'invalid todo'
      })
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
        done()
      })
  })

})

describe('GET /list-todos', () => {
  it('should return all todos in db', (done) => {
    request(app)
      .get('/list-todos')
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body.results.length).toBeGreaterThan(0
        )
        done()
      })
  })
})

describe('GET /get-todo/:id', () => {
  it('should return one todo that matches the query', (done) => {
    request(app)
      .get(`/get-todo/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res, err) => {
        expect(res.body.text).toBe(todos[0].text)
        if (err) done(err)
      })
      .end((err,res) => {
        if (err) done(err)
        done()
      })
  })

  it('should return 404 (bad-request) if no todo matches provided id', (done) => {
    const hexId = new ObjectID().toHexString()

    request(app)
      .get(`/get-todo/${hexId}`)
      .expect(404)
      .end((err, res) => {
        if (err) done (err)
        expect(res.text).toContain('No to-do found')
        done()
      })
  })

  it('should return error 404 sending id in invalid id format', (done) => {
    request(app)
      .get('/get-todo/123abc')
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
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