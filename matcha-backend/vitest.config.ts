import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // or 'istanbul'
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/__tests__/**',
        'src/app.ts',
        'src/model/*.ts',
        'src/errors/*.ts',
        'src/ConstMatcha.ts',
        'src/repo/**',
        'src/util/wrapper.ts',
        'src/service/seedSvc.ts',
        'src/index.ts',
      ]
    },
  },
})