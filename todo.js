const Joi = require('joi')

const todoSchema = Joi.object().keys({
  _id: Joi.objectId(),
  text: Joi.string().required(),
  completed: Joi.boolean().default(false),
  completedAt: Joi.any().default(null),
  createdAt: Joi.date().default(new Date)
})

module.exports = todoSchema