import eh from '../../Configs/errorHandlers.js'
import fs from 'fs/promises'
import path from 'path'

const LocalBaseUrl = process.env.LOCAL_BASE_URL

export default class MockImgsService{
      static mockUploadNewImage = async (file) => {
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
    static mockFunctionDelete = async(imageUrl) => {
      const filename = path.basename(imageUrl)
        if (!path.extname(filename)) {
        throw new Error(`URL inválida, no contiene archivo: ${imageUrl}`)
                }
      const filePath = path.join('./test/helperTest/uploads', filename)
      try {
        await new Promise(res => setTimeout(res, 1000))
        await fs.unlink(filePath)
        return true
      } catch (err) {
        console.error(`Error al borrar imagen local: ${filename}`, err)
        eh.throwError('Error deleting images', 500)
      }
    }
}