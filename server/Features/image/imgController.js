import eh from '../../Configs/errorHandlers.js'
import multer from 'multer'
import ImageHandler from '../../Configs/ImageHandler.js'

// Configuración de Multer
const storage = multer.memoryStorage()
const upload = multer({ storage })

const controllerUploader = eh.catchController(async (req, res) => {
  if (!req.file) {
    eh.throwError('No se subió ningún archivo', 500)
  }
  try {
    const result = await ImageHandler.uploadNewImage(req.file)
    console.log('URL generada:', result)
    res.json({
      url: result
    })
  } catch (error) {
    eh.throwError('Error al subir la imagen', 500)
  }
})
const getImagesFromDb = eh.catchController(async (req, res) => {
  const response = await ImageHandler.getImages()
  res.status(200).json(response)
})

const delImagesFromDb = eh.catchController(async (req, res) => {
  const { id } = req.params
  const isId = true
  const response = await ImageHandler.deleteImageFromDb(id, isId)
  res.status(200).json(response)
})

export { upload, controllerUploader, getImagesFromDb, delImagesFromDb }

// ejemplo url: app.post('/prueba', upload.single('image'), controllerUploader)
