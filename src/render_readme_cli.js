#! /usr/bin/env node

import { program } from 'commander'
import { renderReadme } from 'p24'

const options = program //
	.option('-p, --prefix <string>')
	.option('-g, --glob <string>')
	.option('-t, --template <string>')
	.option('-o, --output <string>')
	.option('-s, --placeholder <string>')
	.parse()
	.opts()

try {
	renderReadme(options)
	process.exit(0)
} catch (err) {
	console.error(err)
	process.exit(1)
}
