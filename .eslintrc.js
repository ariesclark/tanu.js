require("@ariesclark/eslint-config/eslint-patch");

module.exports = {
	root: true,
	extends: ["@ariesclark/eslint-config"],
	parserOptions: {
		// Support eslint in `test` (i.e non-build) folders: https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
		project: ["./tsconfig.json", "./tsconfig.eslint.json"]
	}
};
