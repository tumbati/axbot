/**
 * Import extensions
 */
import './extensions/array'
import './extensions/string'

/**
 * Register module aliases before other processes.
 */
import 'module-alias/register'

import dotenv from 'dotenv'

dotenv.config({
  path: '.env',
})

import { createServer } from 'http'
import app from './app'

let port = normalizePort(process.env.PORT || '5000')
app.set('port', port)

process.env.TZ = process.env.TIMEZONE || 'UTC'

/**
 * Initialize application server
 */
const server = createServer(app)


/**
 * Start application http server
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val: string) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
  console.log('Listening on ' + bind)
}
