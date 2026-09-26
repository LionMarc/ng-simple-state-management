import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['junit', 'default'],
    coverage: {
        reportsDirectory: './artifacts/covergage/store'
    }
  }
});
