//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='style']",
          message:
            'Inline style prop is not allowed. Define styles in src/styles/components/*.css under @layer components and reference a semantic class.',
        },
      ],
      // Layering rule: hooks, components, and routes must not import lib/api directly.
      // HTTP calls live exclusively in features/*/services/*.service.ts
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['#/lib/api/client', '#/lib/api/http'],
              importNames: ['api', 'http'],
              message:
                'Do not call the HTTP layer directly. Use a service in features/*/services/*.service.ts instead.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
]
