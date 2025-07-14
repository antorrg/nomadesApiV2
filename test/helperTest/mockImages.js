import eh from '../../server/Configs/errorHandlers.js'
import { Image } from '../../server/Configs/database.js'
import fs from 'fs/promises'
import path from 'path'

const LocalBaseUrl = process.env.LOCAL_BASE_URL

export default class MockImgsService {
  static uploadNewImage = async (file) => {
    try {
      const uploadDir = './test/helperTest/uploads'
      // Asegurarse que exista la carpeta
      await fs.mkdir(uploadDir, { recursive: true })
      const newPath = path.join(uploadDir, file.originalname)
      await fs.writeFile(newPath, file.buffer)
      return `${LocalBaseUrl}/test/helperTest/uploads/${file.originalname}`
    } catch (error) {
      console.error('Error subiendo: ', error)
      throw error
    }
  }

  static oldImagesHandler = (imageUrl, isRedirect) => {
    return isRedirect ? saveImageInDb(imageUrl) : mockfunctiondelete(imageUrl)
  }

  static deleteImageFromDb = async (data, isId = false) => {
    try {
      const image = isId ? await Image.findByPk(data) : await Image.findOne({ where: { imageUrl: data } })
      if (!image) { eh.throwError('Imagen no hallada', 404) }
      await image.destroy()
      // console.log('imagen borrada')
      return 'Imagen borrada exitosamente'
    } catch (error) { console.error('no se pudo borrar', error); throw error }
  }

  static getImages = async () => {
    try {
      const images = await Image.findAll()
      if (!images) { eh.throwError('Server error in Images', 500) }
      if (images.length === 0) { return [{ id: 'L', imageUrl: 'https://res.cloudinary.com/dt1lpgumr/image/upload/c_scale,w_auto/f_auto,q_auto/roja13.webp?_a=BAMAH2TE0' }] }
      return images
    } catch (error) {
      throw error
    }
  }
}
async function mockfunctiondelete (imageUrl) {
  const filename = path.basename(imageUrl)
  const filePath = path.join('./uploads', filename)
  try {
    await setTimeout(() => { fs.unlink(filePath) }, 1000)
    return true
  } catch (err) {
    console.error('Error al borrar imagen local:', err)
    eh.throwError('Error deleting images', 500)
  }
}
async function saveImageInDb (imageUrl) {
  try {
    const image = await Image.findOne({ where: { imageUrl } })
    if (image) eh.throwError('Esta imagen ya fue guardada', 400)

    const docRef = await Image.create({
      imageUrl
    })
    if (!docRef) {
      eh.throwError('Error inesperado en el servidor', 500)
    }
    return docRef
  } catch (error) {
    throw error
  }
}
