const  expect = require('expect')
const  request = require('supertest')
const { app } = require('../server')

before((done) => {
  app.on('appStarted', () => {
    done()
  })
})

describe('POST /add-todo', () => {

  it('should create a new todo', (done) => {
    const text = { text: 'nozes' }

    request(app)
      .post('/add-todo')
      .send(text)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text.text)
      })
      .end((err, res) => {
        if (err) done(err)
        done()
      })
  })

  
  it('should not create to-do with invalid body data', (done) => {
    request(app)
      .post('/add-todo')
      .send({ 
        text: 'nozes', 
        completed : 'true' 
      })
      .expect(400)
      .end((err, res) => {
        if (err) done(err)
        done()
      })
  })

})

describe('GET /list-todos', () => {
  it('should return all to-dos in db'), (done) => {
    request(app)
      .get('/get-todos')
      .expect(200)
      .end(done)
  }

})