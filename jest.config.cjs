/** Jest + TS + ESM (NodeNext) */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { useESM: true, tsconfig: './tsconfig.jest.json' }
    ]
  },
  moduleFileExtensions: ['ts', 'js'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // يحل imports المنتهية بـ .js إلى نفس المسار بدون الامتداد (لملفات TS)
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/tests/**/*.test.ts'],
  clearMocks: true,
  verbose: true
};
