import path from 'path'
import fs from 'fs'

import parse from './parser.js'
import mdStringify from './md_stringify.js'

export default function (options = {}) {
	const { dir = './src', templateReadme = './README.template.md' } = options

	const components = parse(dir)
	const docs = composeDocs(components)

	const templateFile = path.resolve(templateReadme)
	const content = readFile(templateFile).replace('{{DOCS}}', docs)
	const realFile = path.resolve('./README.md')

	createOrReplaceFile(realFile, content)
}

function composeDocs(components) {
	return components //
		.map((c) => c.nodes)
		.map(mdStringify)
		.join('\n\n')
}

function readFile(file) {
	try {
		return fs.readFileSync(file, { encoding: 'utf-8' })
	} catch (err) {
		console.error(`'${file}' could not be read`)
		throw new Error(err)
	}
}

function createOrReplaceFile(file, content) {
	try {
		fs.writeFileSync(file, content, { encoding: 'utf-8' })
	} catch (err) {
		console.error(err)
		throw new Error(`'${file}' could not be written to`)
	}
}