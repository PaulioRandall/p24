import StringBuilder from './StringBuilder.js'

function has(obj) {
	return !!obj && !!Object.keys(obj).length > 0
}

export const markdown = (node) => {
	const sb = new StringBuilder()

	mdAppendHeader(sb, node)

	const [moduleProps, instanceProps] = filterAndSortProps(node.props)
	const hasScriptNodes = //
		instanceProps.length > 0 ||
		node.contexts.length > 0 ||
		node.events.length > 0 ||
		node.slots.length > 0

	if (moduleProps.length > 0) {
		mdAppendModuleNodes(sb, moduleProps)
	}

	if (hasScriptNodes) {
		mdAppendScriptNodes(
			sb,
			instanceProps,
			node.contexts,
			node.events,
			node.slots
		)
	}

	return sb.toString()
}

const mdAppendHeader = (sb, node) => {
	sb.line('### `<' + node.name + '>`')

	if (node.description) {
		sb.line()
		sb.line(node.description)
	}
}

const filterAndSortProps = (props) => {
	const moduleProps = []
	const instanceProps = []

	for (const p of props) {
		if (p.module) {
			moduleProps.push(p)
		} else {
			instanceProps.push(p)
		}
	}

	const cmp = (a, b) => {
		if (a.const && b.const) {
			return 0
		}

		return a.const ? -1 : 1
	}

	return [
		//
		moduleProps.sort(cmp),
		instanceProps.sort(cmp),
	]
}

const mdAppendModuleNodes = (sb, props) => {
	sb.line()
	sb.line('```svelte')
	sb.line('<script context="module">')

	mdAppendProps(sb, props)

	sb.line('</script>')
	sb.line('```')
}

const mdAppendScriptNodes = (sb, props, ctxs, events, slots) => {
	const hasProps = props.length > 0
	const hasCtxs = ctxs.length > 0
	const hasEvents = events.length > 0
	const hasSlots = slots.length > 0

	sb.line()
	sb.line('```svelte')

	if (hasProps || hasCtxs || hasEvents) {
		sb.line('<script>')
	}

	if (hasProps) {
		mdAppendProps(sb, props)
	}

	if (hasProps && hasCtxs) {
		sb.line()
	}

	if (hasCtxs) {
		mdAppendContexts(sb, ctxs)
	}

	if (hasCtxs && hasEvents) {
		sb.line()
	}

	if (hasEvents) {
		mdAppendEvents(sb, events)
	}

	if (hasProps || hasCtxs || hasEvents) {
		sb.line('</script>')
	}

	if ((hasProps || hasCtxs || hasEvents) && hasSlots) {
		sb.line()
	}

	if (hasSlots) {
		mdAppendSlots(sb, slots)
	}

	sb.line('```')
}

const mdAppendProps = (sb, props) => {
	for (let i = 0; i < props.length; i++) {
		if (i > 0) {
			sb.line()
		}
		mdAppendProp(sb, props[i])
	}
}

const mdAppendProp = (sb, prop) => {
	appendJsComment(sb, prop.description)

	sb.append('  export ')
	sb.append(prop.const ? 'const' : 'let')
	sb.append(' ')
	sb.append(prop.name)

	if (prop.default) {
		sb.append(' = ').append(prop.default)
	}

	sb.line()
}

const mdAppendContexts = (sb, ctxs) => {
	for (let i = 0; i < ctxs.length; i++) {
		if (i > 0) {
			sb.line()
		}
		mdAppendContext(sb, ctxs[i])
	}
}

const mdAppendContext = (sb, ctx) => {
	appendJsComment(sb, ctx.description)

	sb.append('  setContext("')
	sb.append(ctx.name)
	sb.line('", ...)')
}

const mdAppendSlots = (sb, slots) => {
	for (let i = 0; i < slots.length; i++) {
		if (i > 0) {
			sb.line()
		}
		mdAppendSlot(sb, slots[i])
	}
}

const mdAppendSlot = (sb, slot) => {
	appendHtmlComment(sb, slot.description)

	sb.append('<slot')

	if (slot.name !== 'default') {
		sb.append(' name="').append(slot.name).append('"')
	}

	sb.line(' />')
}

const mdAppendEvents = (sb, events) => {
	for (let i = 0; i < events.length; i++) {
		if (i > 0) {
			sb.line()
		}
		mdAppendEvent(sb, events[i])
	}
}

const mdAppendEvent = (sb, event) => {
	appendJsComment(sb, event.description)

	sb.append('  dispatch("')
	sb.append(event.name)
	sb.line('", {})')
}

const appendJsComment = (sb, comment) => {
	comment = comment.replace(/\r/g, '')

	for (const line of comment.split('\n')) {
		sb.line('  // ' + line)
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
		sb.line('  ' + line)
	}
	sb.line('-->')
}

export const html = (node) => {
	const sb = new StringBuilder()

	sb.line('```svelte')
	sb.append('<').append(node.name)

	const hasProps = htmlAppendProps(sb, node.props)

	if (node.slots?.length > 0) {
		sb.line('>')
		htmlAppendSlots(sb, node.slots)
		sb.append('</').append(node.name).line('>')
	} else if (!hasProps) {
		sb.line(' />')
	} else {
		sb.line('/>')
	}

	sb.line('```')
	return sb.toString()
}

const htmlAppendProps = (sb, props) => {
	let first = true

	for (const p of props) {
		if (p.module) {
			continue
		}

		if (first) {
			first = false
			sb.line()
		}

		htmlAppendProp(sb, p)
	}

	return !first
}

const htmlAppendProp = (sb, prop) => {
	sb.append('  ')

	if (prop.const) {
		sb.append('bind:')
	}

	sb.append(prop.name)

	const def = prop.default

	if (!def) {
		sb.line()
		return
	}

	sb.append('=')

	if (def.startsWith('"') && def.endsWith('"')) {
		sb.append(def)
	} else {
		sb.append('{').append(def).append('}')
	}

	sb.line()
}

const htmlAppendSlots = (sb, slots) => {
	for (const s of slots) {
		sb.append('  <div')

		if (s.name !== 'default') {
			sb.append(' slot="').append(s.name).append('"')
		}

		sb.line(' />')
	}
}
