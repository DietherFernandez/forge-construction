import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([...nextVitals, ...nextTs, {files:["app/actions.ts","app/admin/**/*.tsx","app/portal/**/*.tsx","app/projects/**/*.tsx","app/services/page.tsx","app/sitemap.ts","app/api/admin/uploads/route.ts"],rules:{"@typescript-eslint/no-explicit-any":"warn"}}, globalIgnores([".next/**", "out/**", "node_modules/**"])]);
