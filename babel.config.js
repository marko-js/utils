module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        targets: {
          node: "8"
        }
      }
    ]
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-object-rest-spread"
  ],
  env: {
    test: {
      plugins: ["babel-plugin-istanbul"]
    }
  }
};
