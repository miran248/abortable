module.exports = {
  // cache: false,
  // clearMocks: true,
  // collectCoverage: false,
  rootDir: ".",
  testMatch: [
    "**/*\.test\.js",
  ],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  verbose: true,
};