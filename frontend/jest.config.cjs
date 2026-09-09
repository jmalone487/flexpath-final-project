module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx"
  ]
};