import app from './server/app.js'
import env from './server/Configs/envConfig.js'
import { sequelize } from './server/Configs/database.js'
import { configureCloudinary } from './server/cloudinary.js'

app.listen(env.Port, async () => {
  try {
    await sequelize.authenticate()
    if (env.Status === 'production') {
      await configureCloudinary()
    }
    console.log(`Servidor corriendo en http://localhost:${env.Port}\nServer in ${env.Status}`)
    if (env.Status === 'development') {
      await sequelize.sync({ force: false })
      console.log(`Swagger: Vea y pruebe los endpoints en http://localhost:${env.Port}/api-docs`)
    }
  } catch (error) {
    console.error('Error conectando la DB: ', error)
  }
})
