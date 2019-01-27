const Joi = require('joi')
const jwt = require('jsonwebtoken')

const userSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,10}$/).strip().required(),
  tokens: Joi.array().items(
    Joi.object().keys({
      access : Joi.string().required(), 
      token: Joi.string().required()
    })
  ).required()
})

const validateEmail = Joi.string().email({ minDomainAtoms: 2 }).required()
  
const generateAuthToken = (access, id) => {
  return jwt.sign({ _id : id.toHexString(), access }, 'abc123').toString()
}


module.exports = { userSchema, validateEmail, generateAuthToken }
