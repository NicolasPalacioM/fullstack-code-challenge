import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  preset: "ts-jest", // Use ts-jest preset
  testEnvironment: "node", // Define the environment in which the tests should run
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Use ts-jest for ts or tsx files
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json", // Path to your tsconfig.json
    },
  },
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"], // File extensions your modules use
  testMatch: [
    "**/__tests__/**/*.ts", // Look for test files in any __tests__ folder
    "**/?(*.)+(spec|test).ts", // Also match any .spec.ts or .test.ts files anywhere in your project
  ],
};

export default config;
