import env from './envConfig.js'
import { Landing, User, sequelize } from './database.js'

describe('Iniciando tests, probando variables de entorno del archivo "envConfig.js" y existencia de tablas en DB.', () => {
  it('Deberia retornar el estado y la variable de base de datos correcta', () => {
    const formatEnvInfo = `Servidor corriendo en: ${env.Status}\n` +
                   `Base de datos de testing: ${env.DatabaseUrl}`
    expect(formatEnvInfo).toBe('Servidor corriendo en: test\n' +
        'Base de datos de testing: postgres://postgres:antonio@localhost:5432/testing')
  })
  it('Debería hacer una consulta básica en cada tabla sin errores', async () => {
    const models = [
      User,
      Landing
    ]
    for (const model of models) {
      const records = await model.findAll()
      expect(Array.isArray(records)).toBe(true)
      expect(records.length).toBe(0)
    }
  })
  it('Debería verificar la existencia de tablas en la base de datos', async () => {
    const result = await sequelize.query(`
            SELECT tablename 
            FROM pg_catalog.pg_tables 
            WHERE schemaname = 'public';
        `, { type: sequelize.QueryTypes.SELECT })

    const tableNames = result.map(row => row.tablename)

    const expectedTables = [
      'Users', 'Landings', 'Products', 'Items', 'Images', 'Media', 'Abouts', 'Works' // A modo de ejemplo
    ]

    expectedTables.forEach(table => {
      expect(tableNames).toContain(table)
    })
  })
})
describe('Probando la estructura de las tablas en la base de datos', () => {
  const tables = {
    // Estas tablas están a modo de ejemplo
    Users: ['id', 'email', 'password', 'nickname', 'given_name', 'picture', 'role', 'country', 'enable'],
    Landings: ['id', 'title', 'image', 'info_header', 'description', 'enable'],
    Abouts: ['id', 'title', 'image', 'text', 'enable', 'imgShow'],
    Images: ['id', 'imageUrl'],
    Items: ['id', 'img', 'text', 'enable'],
    Media: ['id', 'url', 'type', 'title', 'text', 'enable'],
    Products: ['id', 'title', 'landing', 'info_header', 'info_body', 'to_show', 'enable', 'deleteAt'],
    Works: ['id', 'title', 'image', 'text', 'enable']
  }

  Object.entries(tables).forEach(([tableName, expectedColumns]) => {
    it(`${tableName} debería tener las columnas correctas`, async () => {
      const result = await sequelize.query(`
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = '${tableName}'
            `, { type: sequelize.QueryTypes.SELECT })

      const columns = result.map(row => row.column_name)

      expectedColumns.forEach(col => {
        expect(columns).toContain(col)
      })
    })
  })
})
