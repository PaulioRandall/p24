export const stringifyNodeInstance = (node) => {
	let s = `<` + node.name

	if (node.props) {
		s += stringifyProps(node.props)
	}

	return s + ` />`
}

const stringifyProps = (props) => {
	let s = ''

	if (props.const) {
		s += stringifyConstProps(props.const)
	}

	if (props.let) {
		s += stringifyLetProps(props.let)
	}

	return s
}

const stringifyConstProps = (props) => {
	let s = ''

	for (const name in props) {
		s += `\n\tbind:${name}=${stringifyValue(props[name])}`
	}

	return s ? `\n\t<!-- const -->` + s : s
}

const stringifyLetProps = (props) => {
	let s = ''

	for (const name in props) {
		s += `\n\t${name}=${stringifyValue(props[name])}`
	}

	return s ? `\n\t<!-- let -->` + s : s
}

const stringifyValue = (v) => {
	switch (typeof v) {
		case 'string':
			return `"${v}"`
		// TODO: Objects and Arrays
		default:
			return `{${v}}`
	}
}
