import p23, { cleanFileNode } from 'p23'

export default (options = {}) => {
	options = parseOptions(options)
	return p23(options).map(cleanFileNode)
}

const parseOptions = (userOptions) => {
	return {
		// glob: '**/*.svelte',
		prefix: 'p24.',
		...userOptions,
	}
}

export const trim = (s) => (s ? s.trim() : '')

export const clean = (s) => {
	if (!s) {
		return ''
	}

	let lines = s //
		.split('\n')
		.map(removeTrailingWhitespace)

	lines = trimBlockOfLines(lines)
	const indent = getFirstLineIndent(lines)
	return removePrefixFromLines(lines, indent).join('\n')
}

const removeTrailingWhitespace = (line) => {
	return line.replace(/\s+$/, '')
}

const trimBlockOfLines = (lines) => {
	const result = structuredClone(lines)

	const notEmpty = () => result.length > 0
	const lastIdx = () => result.length - 1
	const firstLineIsEmpty = () => result[0].trim() === ''
	const lastLineIsEmpty = () => result[lastIdx()].trim() === ''

	while (notEmpty() && firstLineIsEmpty()) {
		result.splice(0, 1)
	}

	while (notEmpty() && lastLineIsEmpty()) {
		result.splice(lastIdx(), 1)
	}

	return result
}

const getFirstLineIndent = (lines) => {
	if (lines.length === 0) {
		return ''
	}
	const matches = lines[0].match(/^\s+/)
	return matches ? matches[0] : ''
}

const removePrefixFromLines = (lines, prefix) => {
	return lines.map((l) => {
		return l.startsWith(prefix) ? l.slice(prefix.length) : ''
	})
}
