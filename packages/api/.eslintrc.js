module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "standard-with-typescript",
    "plugin:prettier/recommended",
    "eslint-config-prettier",
  ],
  plugins: ["prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    jsx: true,
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off", // Allow implicit return types on functions
    "@typescript-eslint/no-floating-promises": ["error", { ignoreIIFE: true }],
    "@typescript-eslint/strict-boolean-expressions": "off", // Allow if (foo) { ... } where foo is a boolean
    "@typescript-eslint/no-misused-promises": "off", // Allow Promise<void> to be used in async functions
    "no-console": "error", // Disallow console statements
    "no-extra-boolean-cast": "off", // Allow !!foo expressions
    "prettier/prettier": "error", // Ensure Prettier formatting rules are enforced
    quotes: ["error", "double"], // Enforce double quotes
    semi: ["error", "always"], // Enforce semicolons
  },
};
