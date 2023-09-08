"use strict";

module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:n/recommended"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    sourceType: "module",
  },
  root: true,
};
