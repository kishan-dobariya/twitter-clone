module.exports = {
  env: {
  },
  extends: "eslint:standard",
  parserOptions: {
      ecmaFeatures: {
          jsx: true
      }
  },
  rules: {
      indent: [
          "error",
          "tab"
      ],
      semi: [
          "error",
          "always"
      ]
  }
};
