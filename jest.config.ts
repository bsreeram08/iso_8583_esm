export default {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
    '^.+\\.ts?$': ['ts-jest', { useESM: true }],
  },
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/spec/**/*.[jt]s?(x)",
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
};
