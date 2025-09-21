// ? o    o                            8
// ? 8b   8                            8
// ? 8`b  8 .oPYo. ooYoYo. .oPYo. .oPYo8 .oPYo. .oPYo.
// ? 8 `b 8 8    8 8' 8  8 .oooo8 8    8 8oooo8 Yb..
// ? 8  `b8 8    8 8  8  8 8    8 8    8 8.       'Yb.
// ? 8   `8 `YooP' 8  8  8 `YooP8 `YooP' `Yooo' `YooP'
// ? ..:::..:.....:..:..:..:.....::.....::.....::.....:
// ? ::::::::::::::::::::::::::::::::::::::::::::::::::
// todo :::::: App refactorizada el 12-07-2025:::::::::

import app from './server/app.js'
import env from './server/Configs/envConfig.js'
import { startUp } from './server/Configs/database.js'
import { configureCloudinary } from './server/cloudinary.js'
import initialUser from './server/Features/users/initialUser.js'

app.listen(env.Port, async () => {
  try {
     await startUp()
     await initialUser()
    if (env.Status === 'production') {
      await configureCloudinary()
    }
    console.log(`Servidor corriendo en http://localhost:${env.Port}\nServer in ${env.Status}`)
    if (env.Status === 'development') {
     
      console.log(`Swagger: Vea y pruebe los endpoints en http://localhost:${env.Port}/api-docs`)
    }
  } catch (error) {
    console.error('Error conectando la DB: ', error)
  }
})
