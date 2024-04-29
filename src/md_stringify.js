function StringBuilder() {
	let lines = []

	this.line = (s) => {
		lines.push(s)
	}

	this.gap = () => {
		lines.push('')
	}

	this.toString = () => {
		return lines.join('\n').trim()
	}

	return this
}

function has(obj) {
	return !!obj && !!Object.keys(obj).length > 0
}

export default (node) => {
	const sb = new StringBuilder()

	sb.line('### ' + '`<' + node.name + '>`')

	const hasModuleProps = has(node.module?.const) || has(node.module?.let)
	const hasProps = has(node.props?.const) || has(node.props?.let)
	const hasSlots = has(node.slots)
	const hasAnyHtml = hasModuleProps || hasProps || hasSlots

	if (!node.description && !hasAnyHtml) {
		sb.gap()
		sb.line('> No documentation.')
		return sb.toString()
	}

	if (node.description) {
		sb.gap()
		sb.line(node.description)
	}

	if (hasAnyHtml) {
		sb.gap()
		sb.line('```html')
	}

	if (hasModuleProps) {
		appendProps(sb, node.module, 'module')
	}

	if (hasModuleProps && (hasProps || hasSlots)) {
		sb.gap()
	}

	if (hasProps) {
		appendProps(sb, node.props)
	}

	if (hasProps && hasSlots) {
		sb.gap()
	}

	if (hasSlots) {
		appendSlots(sb, node.slots)
	}

	if (hasAnyHtml) {
		sb.line('```')
	}

	// TODO: Context

	return sb.toString()
}

const appendProps = (sb, props, context = '') => {
	const hasConstProps = has(props.const)
	const hasLetProps = has(props.let)

	if (context) {
		sb.line(`<script context="${context}">`)
	} else {
		sb.line('<script>')
	}

	if (hasConstProps) {
		appendQualifiedProps(sb, 'const', props.const)
	}

	if (hasConstProps && hasLetProps) {
		sb.gap()
	}

	if (hasLetProps) {
		appendQualifiedProps(sb, 'let', props.let)
	}

	sb.line('</script>')
}

const appendQualifiedProps = (sb, qualifier, props) => {
	const entries = Object.entries(props)

	for (let i = 0; i < entries.length; i++) {
		if (i !== 0) {
			sb.gap()
		}

		sb.line('\t// ' + entries[i][1])
		sb.line(`\texport ${qualifier} ${entries[i][0]}`)
	}
}

const appendSlots = (sb, slots) => {
	const entries = Object.entries(slots)

	for (let i = 0; i < entries.length; i++) {
		if (i !== 0) {
			sb.gap()
		}

		sb.line('<!-- ' + entries[i][1] + ' -->')

		if (entries[i][0] === 'default') {
			sb.line(`<slot />`)
		} else {
			sb.line(`<slot name="${entries[i][0]}" />`)
		}
	}
}
