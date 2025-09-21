import { deleteFromCloudinary, uploadToCloudinary } from '../../cloudinary.js'
import MockImgsService from './MockImgsService.js'
import eh from '../../Configs/errorHandlers.js'
import env from '../../Configs/envConfig.js'
import { Image } from '../../Configs/database.js'

const deleteImage = env.Status !== 'production'? MockImgsService.mockFunctionDelete : deleteFromCloudinary
const selectUploaders = env.Status !== 'production'? MockImgsService.mockUploadNewImage : uploadToCloud

export default class ImgsService {
  static #saveImageInDb = async (imageUrl) => {
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

  static #dataParsed = (info) => {
    if (info === 'L') { eh.throwError('No puede eliminarse, imagen referencial', 404) }
    return info
  }

  static uploadNewImage = async(file) =>{
    return await selectUploaders(file)
  } 


  static oldImagesHandler = async(imageUrl, isRedirect) => {
    return isRedirect===true ? await this.#saveImageInDb(imageUrl) : await deleteImage(imageUrl)
  }

  static deleteImageFromDb = async (data, isId) => {
    try {
      const image = isId ? await Image.findByPk(this.#dataParsed(data)) : await Image.findOne({ where: { imageUrl: this.#dataParsed(data) } })
      if (!image) { eh.throwError('Imagen no hallada', 404) }
      await image.destroy()
      console.log('imagen borrada')
      return 'Imagen borrada exitosamente'
    } catch (error) { console.error('no se pudo borrar'); throw error }
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
  const uploadToCloud = async (file) => {
    const result = await uploadToCloudinary(file)
    const httpsWebpUrl = cloudinary.url(result.public_id, {
      secure: true,
      format: 'webp',
      transformation: [
        { width: 'auto', crop: 'scale' },
        { fetch_format: 'auto', quality: 'auto' }
      ]
    })
    return httpsWebpUrl
  }