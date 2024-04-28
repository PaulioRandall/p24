export const stringifyNodeAsHtml = (node) => {
	let s = `<` + node.name

	if (node?.props?.const) {
		s += stringifyHtmlProps('const', 'bind:', node.props.const)
	}

	if (node?.props?.let) {
		s += stringifyHtmlProps('let', '', node.props.let)
	}

	return s + ` />`
}

const stringifyHtmlProps = (qualifier, prefix, props) => {
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

export const stringifyNodeInstancePropsAsJs = (props) => {
	let s = ''

	if (props?.const) {
		s += stringifyJsInstanceProps('const', props.const)
	}

	if (props?.const && props?.let) {
		s += '\n\n'
	}

	if (props?.let) {
		s += stringifyJsInstanceProps('let', props.let)
	}

	return s
}

const stringifyJsInstanceProps = (qualifier, props) => {
	const list = []

	for (const name in props) {
		list.push(`export ${qualifier} ${name} = ${stringifyJsValue(props[name])}`)
	}

	return list.join('\n')
}

const stringifyJsValue = (v) => {
	switch (typeof v) {
		case 'string':
			return `"${v}"`
		// TODO: Objects and Arrays
		default:
			return v
	}
}
