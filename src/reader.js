import p23, { cleanNodes } from 'p23'

export default (options = {}) => {
	options = parseOptions(options)
	const files = p23(options)
	return cleanNodes(files)
}

const parseOptions = (userOptions) => {
	return {
		// glob: '**/*.svelte',
		prefix: '@',
		...userOptions,
	}
}
