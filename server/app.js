import express from 'express'
import path from 'path'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import mainRouter from './routes.js'
import eh from './Configs/errorHandlers.js'
import env from './Configs/envConfig.js'
import { helmetMainConfig } from './Configs/helmetConfig.js'

// Inicializo la app:
const app = express()
if (env.Status !== 'test') {
  app.use(morgan('dev'))
}
app.use(cors())
// app.use(helmet(helmetMainConfig))
// app.use(helmet(helmet.frameguard({ action: "deny" })))
app.use(express.json())
app.use(eh.jsonFormat)
// Habilita Swagger:

if (env.Status !== 'production') {
  app.use(
    '/test/helperTest/uploads',
    express.static(path.join(path.resolve(), '/test/helperTest/uploads')))
}
// ⚠️ Importar Swagger solo en development
if (env.Status === 'development') {
  (async () => {
    const [{ default: swaggerUi }, { default: swaggerJsDoc }, { default: swaggerOptions }] = await Promise.all([
      import('swagger-ui-express'),
      import('swagger-jsdoc'),
      import('./Shared/Swagger/swaggerOptions.js')
    ])
    const swaggerDocs = swaggerJsDoc(swaggerOptions)
    const swaggerUiOptions = {
      swaggerOptions: {
        docExpansion: 'none'
      }
    }
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions))
  })()
}
app.use(mainRouter)

app.use(eh.notFoundRoute)
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Unexpected server error'
  res.status(status).json(message)
})

export default app
