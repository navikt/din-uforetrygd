import { fixupPluginRules } from '@eslint/compat'
import next from '@next/eslint-plugin-next'
import tsParser from '@typescript-eslint/parser'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  {
    ...next.configs['core-web-vitals'],
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { 'react-hooks': fixupPluginRules(reactHooks) },
    rules: reactHooks.configs.recommended.rules,
  },
]
