import express from 'express'
import userRouter from './Features/users/user.routes.js'
import landRouter from './Features/landing/landing.routes.js'
import productRouter from './Features/product/product.routes.js'
import mediaRouter from './Features/media/media.routes.js'
import workRouter from './Features/works/works.routes.js'
import { upload, controllerUploader } from './Features/image/imgController.js'

const mainRouter = express.Router()

mainRouter.post('/api/v2/imgupload', upload.single('image'), controllerUploader) // Ruta de subida de imagenes

mainRouter.use('/api/v2/user', userRouter)

mainRouter.use('/api/v2/land', landRouter)

mainRouter.use('/api/v2/product', productRouter)

mainRouter.use('/api/v2/media', mediaRouter)

mainRouter.use('/api/v2/work', workRouter)

export default mainRouter
