import { beforeAll, afterAll, beforeEach } from 'vitest'
import { sequelize } from '../server/Configs/database.js'
import usersMock from './helperTest/loginToken.help.js'

// Esta función inicializa la base de datos
export async function initializeDatabase () {
  try {
    await sequelize.drop()
    await sequelize.authenticate()
    await sequelize.sync({ force: true }) // Esto limpia y sincroniza la base de datos
    // console.log('Base de datos sincronizada exitosamente ✔️')
  } catch (error) {
    console.error('Error sincronizando DB ❌ ', error)
  }
}

// Esta función resetea la base de datos antes de cada prueba si es necesario
export async function resetDatabase () {
  await sequelize.sync({ force: true })
}

beforeAll(async () => {
  await sequelize.drop()
  await initializeDatabase()
})

// beforeEach(async () => {
//   await resetDatabase();
// });

afterAll(async () => {
  await resetDatabase()
  await sequelize.close()
  // console.log('DB cerrada')
  await sequelize.close().catch((err) => {
    console.error('Error closing sequelize:', err)
  })
})
