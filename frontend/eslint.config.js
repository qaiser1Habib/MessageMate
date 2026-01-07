import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import cypress from 'eslint-plugin-cypress';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      // 'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // 'simple-import-sort/imports': 'error',
      // 'simple-import-sort/exports': 'error',
    },
  },
  // Cypress-specific configuration
  {
    files: ['cypress/**/*.{ts,js}'],
    plugins: {
      cypress: cypress,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {
      // Allow triple-slash references in Cypress files
      '@typescript-eslint/triple-slash-reference': 'off',
      // Allow namespace declarations in Cypress command files
      '@typescript-eslint/no-namespace': 'off',
      // Allow any type in Cypress tests for flexibility
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow unused variables in test files (common in Cypress)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  }
);
