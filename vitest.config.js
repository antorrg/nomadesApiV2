import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true, // Utilizar describe, it sin importar directamente
    setupFiles: ['./test/vitest.setup.js'], // mismo que en Jest
    include: ['server/**/*.test.js', 'test/**/*.int.spec.js'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    // Opcional para reproducir displayName:
    name: 'unit-and-integration'
    // se puede usar filtros al correr tests con CLI
  }
})
