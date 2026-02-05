import nextJest from 'next/jest.js';

const createJestConfig = nextJest();

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testEnvironment: 'jsdom',
  watchman: false,
};

export default createJestConfig(customJestConfig);
