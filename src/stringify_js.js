const props = (props) => {
	let s = ''

	if (props?.const) {
		s += _props('const', props.const)
	}

	if (props?.let) {
		s += _props('let', props.let)
	}

	return s.trim()
}

const _props = (qualifier, props) => {
	const lines = []

	for (const name in props) {
		lines.push('\n')
		lines.push('\n// ' + props[name])
		lines.push(`\nexport ${qualifier} ${name}`)
	}

	return lines.join('')
}

const slots = (slots) => {
	if (!slots || Object.keys(slots).length === 0) {
		return ''
	}

	const lines = []

	for (const name in slots) {
		lines.push('\n')
		lines.push('\n// ' + slots[name])

		if (name === 'default') {
			lines.push(`\n<slot />`)
		} else {
			lines.push(`\n<slot name="${name}" />`)
		}
	}

	return lines.join('').trim()
}

export default {
	props,
	slots,
}
