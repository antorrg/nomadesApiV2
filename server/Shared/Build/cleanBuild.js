import fs from 'fs-extra'
import path from 'path'

const rootDir = path.resolve()
const srcDir = path.join(rootDir, 'server')
const distRootDir = path.join(rootDir, 'dist')
const distServerDir = path.join(distRootDir, 'server')

const shouldExclude = (filePath) => {
  const relPath = path.relative(srcDir, filePath).replace(/\\/g, '/')

  return (
    relPath.startsWith('test') ||
    relPath.startsWith('dist') ||
    relPath.startsWith('Shared/Swagger') ||
    relPath.startsWith('Shared/Build') ||
    relPath.endsWith('.test.js') ||
    relPath.endsWith('.help.js')
  )
}

const copyFiltered = async () => {
  console.log('🧹 Generando build limpio...')
  // Limpiar dist
  await fs.remove(distRootDir)
  // Copiar /server filtrado
  await fs.copy(srcDir, distServerDir, {
    filter: (src) => {
      const stat = fs.statSync(src)
      if (stat.isDirectory()) return true
      return !shouldExclude(src)
    }
  })

  // Copiar index.js desde la raíz del proyecto
  const indexSrc = path.join(rootDir, 'server.js')
  const indexDest = path.join(distRootDir, 'server.js')

  if (await fs.pathExists(indexSrc)) {
    await fs.copy(indexSrc, indexDest)
    console.log('📦 server.js copiado a /dist')
  }

  console.log('✅ Build limpio generado en /dist')
}

copyFiltered().catch(err => {
  console.error('❌ Error generando el build limpio:', err)
  process.exit(1)
})
