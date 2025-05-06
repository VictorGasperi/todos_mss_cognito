module.exports = {
    testEnvironment: 'node',
    testMatch: [ '**/tests/**/*.test.ts' ],
    transform: {
      '^.+\\.ts$': 'ts-jest', // Transforma arquivos TypeScript
    }
}