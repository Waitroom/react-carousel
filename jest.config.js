module.exports = {
	coverageDirectory: 'coverage',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{ts,tsx}'],
	coverageThreshold: {
		global: {
			branches: 75,
			functions: 75,
			lines: 75,
			statements: 75,
		},
	},
	testEnvironment: 'jsdom',
	testPathIgnorePatterns: ['<rootDir>/__tests__/__fixtures__/'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
		'^.+\\.css$': 'jest-transform-css',
	},
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
