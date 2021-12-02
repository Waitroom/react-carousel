module.exports = {
	coverageDirectory: 'coverage',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{ts,tsx}'],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 70,
			lines: 70,
			statements: 70,
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
