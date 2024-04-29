import path from 'path'
import fs from 'fs'
import { parse, mdStringify } from '../src/index.js'

try {
	const components = parse('./src')
	const docs = components //
		.map((c) => c.nodes)
		.map(mdStringify)
		.join('\n\n')

	const templateFile = path //
		.resolve('./README.template.md')

	const content = //
		readFile(templateFile).replace('{{DOCS}}', docs)

	const realFile = path.resolve('./README.md')
	createOrReplaceFile(realFile, content)
} catch (err) {
	console.error(err)
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
