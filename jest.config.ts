/** @jest-config-loader ts-node */
import type { Config } from 'jest';

const sharedIgnorePatterns = [
  '/node_modules/',
  '/babel.config.js',
  '/jest.setup.js',
  '/.expo/',
  '/.expo-shared/',
  '/web-build/',
  '/assets/',
  '/.tamagui/',
  '/ios/',
  '/android/',
  'constants',
  'theme'
]

const config: Config = {
  verbose: true,
  preset: 'jest-expo',
  rootDir: ".",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  collectCoverageFrom: ["src/**/*.(t|j)(s|sx)"],
  coveragePathIgnorePatterns: [...sharedIgnorePatterns],
  testPathIgnorePatterns: [...sharedIgnorePatterns],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    }
  },
};

export default config;