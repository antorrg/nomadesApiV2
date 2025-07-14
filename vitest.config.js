// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true, // Utilizar describe, it sin importar directamente
    setupFiles: ['./test/jest.setup.js'], // mismo que en Jest
    include: ['server/**/*.test.js', 'test/**/*.int.spec.js'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    // Opcional para reproducir displayName:
    name: 'unit-and-integration'
    // se puede usar filtros al correr tests con CLI
  }
})

// // vitest.config.js
// import { defineConfig } from 'vitest/config'

// export default defineConfig({
//   test: {
//     environment: 'node',
//     globals: true, // si querés usar describe, it, expect sin importar
//     setupFiles: ['./test/jest.setup.js'] // si querés iniciar mocks o base de datos
//   }
// })
