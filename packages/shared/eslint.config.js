import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  // 対象外
  {
    ignores: ['node_modules/**'],
  },

  // JS 推奨
  js.configs.recommended,

  // TypeScript 型チェックあり推奨
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 全 TS ファイル共通ルール
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },

  // テストファイル向け緩和
  {
    files: ['src/**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // テストでは async 関数が Promise を返すマーカーとして使われるため
      '@typescript-eslint/require-await': 'off',
    },
  },

  // Prettier と競合するフォーマットルールを無効化
  prettierConfig,
)
