import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@': new URL('.', import.meta.url).pathname,
    },
  },
})
