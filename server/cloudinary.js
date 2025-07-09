import { v2 as cloudinary } from 'cloudinary'
import env from './Configs/envConfig.js'
import path from 'path'
import eh from './Configs/errorHandlers.js'

// Función para verificar la conexión con Cloudinary
async function testCloudinaryConnection () {
  try {
    const result = await cloudinary.api.ping()
    console.log('Conexión exitosa con Cloudinary:', result)
    return true
  } catch (error) {
    console.error('Error al conectar con Cloudinary:', error)
    return false
  }
}

const uploadStream = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
    stream.write(buffer)
    stream.end()
  })
}

// Función para subir imagen a Cloudinary
async function uploadToCloudinary (file) {
  const options = {
    resource_type: 'auto',
    public_id: path.parse(file.originalname).name,
    format: 'webp'
  }
  try {
    const result = await uploadStream(file.buffer, options)
    return result
  } catch (error) {
    throw error
  }
}

function extractPublicIdFromUrl (url) {
  try {
    const urlParts = url.split('/')
    const lastPart = urlParts[urlParts.length - 1]

    // Buscamos el índice del último punto para separar la extensión
    const lastDotIndex = lastPart.lastIndexOf('.')
    if (lastDotIndex === -1) {
      throw new Error('La URL no contiene una extensión válida')
    }

    // Extraemos el publicId sin dividir mal por puntos internos
    const publicId = lastPart.substring(0, lastDotIndex)
    console.log(publicId)
    return publicId
  } catch (error) {
    throw new Error('URL de Cloudinary inválida')
  }
}

// Función para eliminar imagen de Cloudinary
async function deleteFromCloudinary (imageUrl) {
  try {
    // const publicId = extractPublicIdFromUrl(imageUrl);
    const publicId = decodeURIComponent(extractPublicIdFromUrl(imageUrl))
    console.log('publicId:', publicId)

    const result = await cloudinary.uploader.destroy(publicId)
    console.log(result)
    if (result.result === 'ok') {
      // console.log('eliminacion: ')
      return {
        success: true,
        message: 'Imagen eliminada correctamente',
        result
      }
    } else {
      eh.throwError('Error al eliminar imagen', 500)
    }
  } catch (error) {
    throw error
  }
}

// Función para configurar Cloudinary
const configureCloudinary = async () => {
  cloudinary.config({
    cloud_name: env.CloudName,
    api_key: env.CloudApiKey,
    api_secret: env.CloudApiSecret
  })
  console.log('Configuración de Cloudinary aplicada')
  // const isConnected = await testCloudinaryConnection();
  // if (!isConnected) {
  //   throw new Error('No se pudo establecer conexión con Cloudinary');
  // }
}

export { uploadToCloudinary, configureCloudinary, deleteFromCloudinary }

// configuracion en app:
/* configureCloudinary({
    cloud_name:
    api_key:
    api_secret:
  }); */
