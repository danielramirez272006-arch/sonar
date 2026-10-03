module.exports = {
  testEnvironment: '<rootDir>/tests/jest-env.cjs',
  testMatch: ['<rootDir>/tests/**/*.test.{js,jsx}'],
  testTimeout: 15000,
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|svg|png|jpg|jpeg|gif|webp)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(lucide-react|@blobatar|blobatar|framer-motion|motion-dom|motion-utils)/)'],
}
