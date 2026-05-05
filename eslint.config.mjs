import next from "eslint-config-next";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	...next(),
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
		"node_modules/**",
	]),
]);
