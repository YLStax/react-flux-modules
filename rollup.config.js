import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import sourcemaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
	input: `src/${pkg.name}.tsx`,
	output: [
		{ file: pkg.main, name: pkg.name, format: 'umd', sourcemap: true },
		{ file: pkg.module, format: 'es', sourcemap: true },
	],
	external: [
		'react',
		'react-dom',
	],
	plugins: [
		babel({ exclude: 'node_modules/**' }),
		commonjs(),
		json(),
		resolve({ jsnext: true }),
		sourcemaps(),
		typescript({ useTsconfigDeclarationDir: true }),
	]
}
