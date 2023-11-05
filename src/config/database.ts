import database from 'mongoose'

database.set('strictQuery', true)

const mongoEnvVars: string[] = [
  'MONGO_HOST',
  'MONGO_PORT',
  'MONGO_USER',
  'MONGO_PASSWORD',
  'MONGO_DB_NAME',
  'MONGO_AUTH_SOURCE',
  'MONGO_AUTH_MECHANISM',
]

const env = process.env

for (const mongoVar of mongoEnvVars) {
  if (!env[mongoVar]) {
    throw `${mongoVar} is required to connect to the database.`
  }
}

let url = `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}`

if (env.NODE_ENV !== 'production') {
  url = `${url}:${env.MONGO_PORT}`
}

const mongoConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  dbName: env.MONGO_DB_NAME,
  authSource: env.MONGO_AUTH_SOURCE,
}

database.connect(url, mongoConnectionOptions)
  .then(_ => console.log('Mongo connected.'))
  .catch(err => {
    throw new Error(err)
  })

export default database
