#! /usr/bin/env node

import { program } from 'commander'
import { renderReadme } from 'p24'

const options = program //
	.option('--pre, --prefix <string>')
	.option('-g, --glob <string>')
	.option('-t, --template <string>')
	.option('-p, --placeholder <string>')
	.parse()
	.opts()

try {
	renderReadme(options)
} catch (err) {
	console.error(err)
}
