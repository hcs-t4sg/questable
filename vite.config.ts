import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import { VitePluginFonts } from 'vite-plugin-fonts'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		viteTsconfigPaths(),
		svgrPlugin(),
		VitePluginFonts({
			custom: {
				/**
				 * Fonts families lists
				 */
				families: [
					{
						/**
						 * Name of the font family.
						 */
						name: 'Superscript',
						/**
						 * Local name of the font. Used to add `src: local()` to `@font-rule`.
						 */
						local: 'Superscript',
						/**
						 * Regex(es) of font files to import. The names of the files will
						 * predicate the `font-style` and `font-weight` values of the `@font-rule`'s.
						 */
						src: './src/styles/fonts/SUPERSCR.ttf',
					},
				],
			},
		}),
	],
	server: {
		open: true,
	},
})
