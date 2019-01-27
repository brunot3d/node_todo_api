const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')

// const message = 'I am user number 3'
// const hash = SHA256(message).toString()

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)


// const data = {
//   id: 4
// }
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'some_secret').toString()
// }

// const resultHash = SHA256(JSON.stringify(token.data) + 'some_secret').toString()

// if (resultHash === token.hash) {
//   console.log('Data wat not changed.')
// } else {
//   console.log('Data was changed.')
// }

const data = {
  id : 10
}

const token = jwt.sign(data, '123abc')

console.log('token: ',token)

const decoded = jwt.verify(token, '123abc')

console.log('decoded: ', decoded)