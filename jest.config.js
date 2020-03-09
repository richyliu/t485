module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFiles: ["./src/setupTests.ts"],
  modulePathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/",
    "<rootDir>/.cache/",
    "<rootDir>/.stryker-tmp/",
  ],
}
