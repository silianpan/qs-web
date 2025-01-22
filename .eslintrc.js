module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    //'eslint:recommended',
    'plugin:vue/strongly-recommended',
    'prettier'
  ],
  rules: {
    'no-console': 'off',
    //'no-debugger': import.meta.env.MODE === 'production' ? 'error' : 'off',
    'no-debugger': 'off',
    'generator-star-spacing': 'off',
    'no-mixed-operators': 0,
    'vue/max-attributes-per-line': 'off',
    // 'vue/max-attributes-per-line': [
    //   2,
    //   {
    //     'singleline': 5,
    //     'multiline': {
    //       'max': 1,
    //       'allowFirstLine': false
    //     }
    //   }
    // ],
    'vue/attribute-hyphenation': 0,
    'vue/html-self-closing': 0,
    'vue/component-name-in-template-casing': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/singleline-html-element-content-newline': 0,
    // 'vue/no-unused-components': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/no-parsing-error': 0,
    // vite版本新增
    'vue/multi-word-component-names': 0,
    'vue/v-slot-style': 0,
    'vue/component-definition-name-casing': 0,
    'no-tabs': 0,
    'quotes': [
      2,
      'single',
      {
        'avoidEscape': true,
        'allowTemplateLiterals': true
      }
    ],
    'semi': [
      2,
      'never',
      {
        'beforeStatementContinuationChars': 'never'
      }
    ],
    'no-delete-var': 2,
    'prefer-const': [
      2,
      {
        'ignoreReadBeforeAssign': false
      }
    ],
    'template-curly-spacing': 'off',
    'indent': ['off', 2],
    'space-before-function-paren': 0
  },
  parserOptions: {
    //parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
