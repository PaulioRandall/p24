#! /usr/bin/env node

import { program } from 'commander'
import { renderReadme } from 'p24'

const options = program //
	.option('-p, --prefix <string>')
	.option('-g, --glob <string>')
	.parse()
	.opts()

try {
	renderReadme(options)
} catch (err) {
	console.error(err)
}
