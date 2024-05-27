import StringBuilder from './StringBuilder.js'

export default (node) => {
	const sb = new StringBuilder()

	sb.line('```svelte')
	sb.append('<')
	sb.append(node.name)

	if (node?.prop?.const) {
		appendProps(sb, node.prop.const, node.default.prop.const, 'bind:')
	}

	if (node?.prop?.let) {
		appendProps(sb, node.prop.let, node.default.prop.let)
	}

	if (node?.slot && Object.keys(node.slot).length > 0) {
		sb.append('>')
		appendSlots(sb, node.slot)
		sb.line()
		sb.append('</')
		sb.append(node.name)
		sb.line('>')
	} else {
		sb.line(' />')
	}

	sb.line('```')

	return sb.toString()
}

const appendProps = (sb, props, defaults, prefix = '') => {
	for (const name in props) {
		sb.line()
		sb.append('  ')
		sb.append(prefix)
		sb.append(name)

		const def = defaults[name]

		if (!def) {
			continue
		}

		if (def.startsWith('"') && def.endsWith('"')) {
			sb.append('=')
			sb.append(def)
		} else {
			sb.append('={')
			sb.append(def)
			sb.append('}')
		}
	}
}

const appendSlots = (sb, slots) => {
	for (const name in slots) {
		sb.line()
		sb.append('  <tag')

		if (name !== 'default') {
			sb.append(' slot="')
			sb.append(name)
			sb.append('"')
		}

		sb.append(' />')
	}
}
