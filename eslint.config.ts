import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

if (!reactHooks.configs.flat.recommended) {
  throw new Error('reactHooks.configs.flat.recommended is not defined');
}

export default defineConfig([
  globalIgnores([
    'node_modules/**',
    'ios/**',
    'android/**',
    'lib/**',
    '.yarn/**',
    '.vscode/**',
    '.github/**',
    '.git/**',
    'docs/**',
    'example/**',
  ]),
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'off',
    },
  },
]);
