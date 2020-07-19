module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: [
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "standard",
    "plugin:prettier/recommended",
    "prettier/react",
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
  plugins: ["react", "react-hooks"],
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
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  settings: {
    "import/resolver": "webpack",
    react: {
      version: "detect",
    },
  },
};
