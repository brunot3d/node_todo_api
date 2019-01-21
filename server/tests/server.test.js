const expect = require('expect')
const request = require('supertest')
const {
  app
} = require('../server')
const {
  ObjectId
} = require('mongodb')

let todos = [ {
  _id: new ObjectId(),
  text: 'nozes primerão - from tests'
}, {
  _id: new ObjectId(),
  text: 'from tests 2'
} ]


before((done) => {
  app.on('appStarted', () => {
    done()
  })
})


it('should delete all documents in to-dos collection', (done) => {
  request(app)
    .get('/delete-all')
    .expect(200)
    .end(done)
})

describe('POST /add-todo', () => {
  it('should create a new todo', (done) => {

    request(app)
      .post('/add-todo')
      .send(todos[0])
      .expect(200)
      .expect((res) => {
        // console.log(res.body.document.text)
        expect(res.body.document.text).toBe(todos[0].text)
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
        expect(res.body.results.length).toBeGreaterThan(-1)
        done()
      })
  })
})

describe('GET /get-todo/:id', () => {
  it('should return one todo that matches the query', (done) => {
    request(app)
      .get(`/get-todo/${todos[0]._id.toHexString()}`)
      // .expect(200)
      .expect((res, err) => {
        expect(res.body.text).toBe(todos[0].text)
        if (err) done(err)
      })
      .end((err,res) => {
        if (err) return done(err)
        done()
      })
  })

  it('should return 404 (bad-request) if no todo matches provided id', (done) => {
    const hexId = new ObjectId().toHexString()

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

describe('PATCH /todos/:id', () => {
  it('Should updated a todo', (done) => {
    const body = {
      text : 'UPDATING from tests 4',
      completed: true
    }
    const id = todos[0]._id.toHexString()

    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.doc.value.text).toBe(body.text)
        expect(res.body.doc.value.completed).toBe(body.completed)
        expect(typeof res.body.doc.value.completedAt).toBe('number')
        done()
      })
  })

})

describe('DELETE /delete-todo/:id', () => {
  it('should remove a todo', (done) => {
    const hexId = todos[0]._id.toHexString()

    request(app)
      .delete(`/delete-todo/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.n).toBe(1)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        request(app)
          .get(`/get-todo/${hexId}`)
          .expect(404)
          .end((err, res) => {
            if (err)
              return done(err)
            done()
          })
      })
  })

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete('/delete-todo/1234abc')
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        done()
      })
  })
})

