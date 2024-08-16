import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import logger from 'morgan'
import routes from 'src/config/routes'

const app = express()

app.use(cors({ origin: '*' }))

/**
 * Set express http requests conversions
 */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'))
}

/**
 * routes
 */
app.use('/', routes)

/**
 * Error handler
 */
app.use(
  (
    err: { message: string; status: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
  }
)

export default app
