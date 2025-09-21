import fs from 'fs'
import path from 'path'

export default function createMockFile (filename = 'test.jpg') {
  // const filePath = path.join(__dirname, 'assets', filename)
  const filePath = path.join(process.cwd(), 'test', 'helperTest', 'assets', filename)
  try {
    const buffer = fs.readFileSync(filePath)
    return {
      fieldname: 'image',
      originalname: filename,
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer,
      size: buffer.length
    }
  } catch (error) {
    console.error('createMockFile error:', error)
    throw error // no lo silencies, para que falle bien el test
  }
}
export  function mockImages (){
  const src = path.join(fixtureDir, "sample.png");
  const dest = path.join(uploadDir, "sample.png");
   fs.copyFile(src, dest);
}