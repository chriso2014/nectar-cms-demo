const eslintconfig = {
  extends: ['@boltui/eslint-config', 'prettier'],
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  rules: {
    'import/prefer-default-export': false,
    'react/forbid-prop-types': 1,
    'jsx-a11y/anchor-is-valid': 1,
  },
}

module.exports = eslintconfig
