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
	const hasContext = has(node.context)
	const hasAnyHtml = hasModuleProps || hasProps || hasSlots || hasContext

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
		sb.line(`<script context="module">`)
		appendProps(sb, node.module)
		sb.line('</script>')
	}

	if (hasModuleProps && (hasProps || hasSlots || hasContext)) {
		sb.gap()
	}

	if (hasProps || hasContext) {
		sb.line(`<script>`)
	}

	if (hasProps) {
		appendProps(sb, node.props)
	}

	if (hasProps && hasContext) {
		sb.gap()
	}

	if (hasContext) {
		appendContext(sb, node.context)
	}

	if (hasProps || hasContext) {
		sb.line(`</script>`)
	}

	if ((hasProps || hasContext) && hasSlots) {
		sb.gap()
	}

	if (hasSlots) {
		appendSlots(sb, node.slots)
	}

	if (hasAnyHtml) {
		sb.line('```')
	}

	return sb.toString()
}

const appendProps = (sb, props) => {
	const hasConstProps = has(props.const)
	const hasLetProps = has(props.let)

	if (hasConstProps) {
		appendQualifiedProps(sb, 'const', props.const)
	}

	if (hasConstProps && hasLetProps) {
		sb.gap()
	}

	if (hasLetProps) {
		appendQualifiedProps(sb, 'let', props.let)
	}
}

const appendQualifiedProps = (sb, qualifier, props) => {
	const entries = Object.entries(props)

	for (let i = 0; i < entries.length; i++) {
		if (i !== 0) {
			sb.gap()
		}

		appendJsComment(sb, entries[i][1])
		sb.line(`\texport ${qualifier} ${entries[i][0]}`)
	}
}

const appendContext = (sb, context) => {
	const entries = Object.entries(context)

	for (let i = 0; i < entries.length; i++) {
		if (i !== 0) {
			sb.gap()
		}

		appendJsComment(sb, entries[i][1])
		sb.line(`\tsetContext('${entries[i][0]}', ...)`)
	}
}

const appendJsComment = (sb, comment) => {
	comment = comment.replace(/\r/g, '')

	for (const line of comment.split('\n')) {
		sb.line('\t// ' + line.trim())
	}
}

const appendSlots = (sb, slots) => {
	const entries = Object.entries(slots)

	for (let i = 0; i < entries.length; i++) {
		if (i !== 0) {
			sb.gap()
		}

		appendHtmlComment(sb, entries[i][1])

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
		sb.line('\t' + line.trim())
	}
	sb.line('-->')
}
