import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
	tseslint.configs.recommended,
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		languageOptions: { globals: globals.browser },
		rules: {
			"prefer-const": "error",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unsafe-function-type": "off",
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "variableLike",
					format: ["snake_case"],
				},
			],
			"@typescript-eslint/no-unused-expressions": "warn",
		},
	},
]);
