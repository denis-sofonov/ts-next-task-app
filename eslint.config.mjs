import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// ESLint is kept solely for the Next.js-specific correctness rules that Biome
// does not provide (core-web-vitals: next/image, next/link, hydration, etc.).
// Formatting, import sorting and general linting are handled by Biome.
const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/server/db/migrations/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
