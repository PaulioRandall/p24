import path from 'path'
import fs from 'fs'

import read from './reader.js'
import parse from './parser.js'
import { markdown, html } from './stringify.js'

export default function (options = {}) {
	options = {
		prefix: '@', //
		glob: '**/*.svelte',
		globOptions: undefined,
		template: './README.template.md',
		output: './README.md',
		placeholder: '{{PLACEHOLDER}}',
		...options,
	}

	const rawComponents = read(options)
	const components = rawComponents.map(parse)
	const docs = composeDocs(components)

	const templateFile = path.resolve(options.template)
	const content = //
		readFile(templateFile) //
			.replace(options.placeholder, docs)

	const realFile = path.resolve(options.output)
	createOrReplaceFile(realFile, content)
}

function composeDocs(components) {
	return components //
		.map((n) => [
			markdown(n), //
			html(n),
		])
		.flat()
		.join('\n\n')
}

function readFile(file) {
	try {
		return fs.readFileSync(file, { encoding: 'utf-8' })
	} catch (err) {
		console.error(`'${file}' could not be read`)
		throw err
	}
}

function createOrReplaceFile(file, content) {
	try {
		fs.writeFileSync(file, content, { encoding: 'utf-8' })
	} catch (err) {
		console.error(`'${file}' could not be written to`)
		throw err
	}
}
