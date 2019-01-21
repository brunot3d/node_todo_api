var env = process.env.NODE_ENV || 'development'

console.log('env *****', env)

if (env === 'development') {
  process.env.MONGO_URI = 'mongodb://localhost:27017/brunotdb'
  process.env.PORT = 3000
} else if (env === 'test') {
  process.env.MONGO_URI = 'mongodb://localhost:27017/TodoApp'
  process.env.PORT = 3000
} else if (env === 'production') {
  console.log('from cfg', process.env.PORT)
  process.env.MONGO_URI = 'mongodb://brunot:c965492a50b519451be98427ea60397b@ds255784.mlab.com:55784/brunotdb'
}