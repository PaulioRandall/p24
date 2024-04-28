// TODO: Rethink how to do HTML.
// TODO: Mock up how I think it should look.

export const stringifyInstancePropsAsHtml = (node) => {
	let s = `<` + node.name

	if (node?.props?.const) {
		s += stringifyHtmlIstanceProps('const', 'bind:', node.props.const)
	}

	if (node?.props?.let) {
		s += stringifyHtmlIstanceProps('let', '', node.props.let)
	}

	return s + ` />`
}

const stringifyHtmlIstanceProps = (qualifier, prefix, props) => {
	let s = ''

	for (const name in props) {
		s += `\n\t${prefix}${name}=${stringifyHtmlValue(props[name])}`
	}

	return s ? `\n\t<!-- ${qualifier} -->` + s : s
}

const stringifyHtmlValue = (v) => {
	switch (typeof v) {
		case 'string':
			return `"${v}"`
		// TODO: Objects and Arrays
		default:
			return `{${v}}`
	}
}

export const stringifyInstancePropsAsJs = (props) => {
	let s = ''

	if (props?.const) {
		s += stringifyJsInstanceProps('const', props.const)
	}

	if (props?.let) {
		s += stringifyJsInstanceProps('let', props.let)
	}

	return s.trim()
}

const stringifyJsInstanceProps = (qualifier, props) => {
	const lines = []

	for (const name in props) {
		lines.push('\n')
		lines.push('\n// ' + props[name])
		lines.push(`\nexport ${qualifier} ${name}`)
	}

	return lines.join('')
}
