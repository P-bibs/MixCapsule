module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: [
    "plugin:import/errors",
    "plugin:import/warnings",
    "standard",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: [],
  rules: {
    "prettier/prettier": [
      2,
      {
        semi: true,
        singleQuote: false,
      },
    ],
    "dot-notation": "off",
    "no-unused-vars": "warn",
  },
  settings: {
    "import/resolver": "webpack",
    react: {
      version: "detect",
    },
  },
};
