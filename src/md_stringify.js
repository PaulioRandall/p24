import StringBuilder from './StringBuilder.js'

function has(obj) {
	return !!obj && !!Object.keys(obj).length > 0
}

export default (node) => {
	const sb = new StringBuilder()

	sb.line('### ' + '`<' + node.name + '>`')

	const hasModuleProps = has(node.module?.const) || has(node.module?.let)
	const hasProps = has(node.prop?.const) || has(node.prop?.let)
	const hasSlots = has(node.slot)
	const hasContext = has(node.context)
	const hasAnyHtml = hasModuleProps || hasProps || hasSlots || hasContext

	if (!node.description && !hasAnyHtml) {
		sb.line()
		sb.line('> No documentation.')
		return sb.toString()
	}

	if (node.description) {
		sb.line()
		sb.line(node.description)
	}

	if (hasAnyHtml) {
		sb.line()
		sb.line('```svelte')
	}

	if (hasModuleProps) {
		sb.line(`<script context="module">`)
		appendProps(sb, node.module, node.default.module)
		sb.line('</script>')
	}

	if (hasModuleProps && (hasProps || hasSlots || hasContext)) {
		sb.line()
	}

	if (hasProps || hasContext) {
		sb.line(`<script>`)
	}

	if (hasProps) {
		appendProps(sb, node.prop, node.default.prop)
	}

	if (hasProps && hasContext) {
		sb.line()
	}

	if (hasContext) {
		appendContext(sb, node.context)
	}

	if (hasProps || hasContext) {
		sb.line(`</script>`)
	}

	if ((hasProps || hasContext) && hasSlots) {
		sb.line()
	}

	if (hasSlots) {
		appendSlots(sb, node.slot, node.default.slot)
	}

	if (hasAnyHtml) {
		sb.line('```')
	}

	return sb.toString()
}

const appendProps = (sb, props, defaults) => {
	const hasConstProps = has(props.const)
	const hasLetProps = has(props.let)

	if (hasConstProps) {
		appendQualifiedProps(sb, 'const', props.const, defaults.const)
	}

	if (hasConstProps && hasLetProps) {
		sb.line()
	}

	if (hasLetProps) {
		appendQualifiedProps(sb, 'let', props.let, defaults.let)
	}
}

const appendQualifiedProps = (sb, qualifier, props, defaults) => {
	const entries = Object.entries(props)

	for (let i = 0; i < entries.length; i++) {
		if (i !== 0) {
			sb.line()
		}

		appendJsComment(sb, entries[i][1])

		let line = `\texport ${qualifier} ${entries[i][0]}`
		const value = defaults[entries[i][0]] || ''

		if (value) {
			if (!value.startsWith('//') && !value.startsWith('/*')) {
				line += ` =`
			}
			line += ` ${value}`
		}

		sb.line(line)
	}
}

const appendContext = (sb, context) => {
	const entries = Object.entries(context)

	for (let i = 0; i < entries.length; i++) {
		if (i !== 0) {
			sb.line()
		}

		appendJsComment(sb, entries[i][1])
		sb.line(`\tsetContext('${entries[i][0]}', ...)`)
	}
}

const appendJsComment = (sb, comment) => {
	comment = comment.replace(/\r/g, '')

	for (const line of comment.split('\n')) {
		sb.line('\t// ' + line)
	}
}

const appendSlots = (sb, slots, defaults) => {
	const entries = Object.entries(slots)

	for (let i = 0; i < entries.length; i++) {
		if (i !== 0) {
			sb.line()
		}

		appendHtmlComment(sb, entries[i][1])
		if (defaults[entries[i][0]]) {
			appendHtmlComment(sb, 'Default: ' + defaults[entries[i][0]])
		}

		if (entries[i][0] === 'default') {
			sb.line(`<slot />`)
		} else {
			sb.line(`<slot name="${entries[i][0]}" />`)
		}
	}
}

const appendHtmlComment = (sb, comment) => {
	comment = comment.replace(/\r/g, '')

	if (!comment.includes('\n')) {
		sb.line('<!-- ' + comment + ' -->')
		return
	}

	sb.line('<!--')
	for (const line of comment.split('\n')) {
		sb.line('\t' + line)
	}
	sb.line('-->')
}
