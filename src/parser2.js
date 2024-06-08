import { trim, clean } from './formatters.js'
import StringBuilder from './StringBuilder.js'

//@component
//@prop
//@slot
//@ctx
//@on

//@name
//@module
//@alias
//@default

export default (data) => {
	const result = {}

	parseComponent(result, data)
	parseProps(result, data)
	parseSlots(result, data)
	parseContexts(result, data)
	parseEvents(result, data)

	return result
}

const parseComponent = (result, data) => {
	result.name = data.name?.split('.')[0] || ''
	result.description = ''

	const component = data.nodes['component']
	if (!component || component.length === 0) {
		return
	}

	const [name, desc, ...mods] = splitContent(component[0])
	result.name = name || result.name
	result.description = desc || ''
}

const parseProps = (result, data) => {
	const rawProps = data.nodes['prop']
	result.props = []

	if (!rawProps || rawProps.length === 0) {
		return
	}

	for (const p of rawProps) {
		result.props.push(parseProp(p))
	}
}

const parseProp = (rawProp) => {
	const [content, mods] = separateModifiers(rawProp)
	const [name, desc] = separateNameAndDesc(content)

	return {
		name: name,
		description: desc,
		alias: parseModAlias(mods),
		const: '@const' in mods,
		module: '@module' in mods,
		default: parseModString(mods, '@default'),
	}
}

const parseSlots = (result, data) => {
	const rawSlots = data.nodes['slot']
	result.slots = []

	if (!rawSlots || rawSlots.length === 0) {
		return
	}

	for (const s of rawSlots) {
		result.slots.push(parseSlot(s))
	}
}

const parseSlot = (rawSlot) => {
	const [desc, mods] = separateModifiers(rawSlot)
	const name = mods['@name']

	return {
		name: name?.trim() ? name.trim() : 'default',
		description: desc,
	}
}

const parseContexts = (result, data) => {
	const rawCtxs = data.nodes['ctx']
	result.contexts = []

	if (!rawCtxs || rawCtxs.length === 0) {
		return
	}

	for (const c of rawCtxs) {
		result.contexts.push(parseContext(c))
	}
}

const parseContext = (rawCtx) => {
	const [content, mods] = separateModifiers(rawCtx)
	const [name, desc] = separateNameAndDesc(content)

	return {
		name: name.trim(),
		description: desc.trim(),
	}
}

const parseEvents = (result, data) => {
	const rawEvents = data.nodes['on']
	result.events = []

	if (!rawEvents || rawEvents.length === 0) {
		return
	}

	for (const e of rawEvents) {
		result.events.push(parseEvent(e))
	}
}

const parseEvent = (rawEvent) => {
	const [content, mods] = separateModifiers(rawEvent)
	const [name, desc] = separateNameAndDesc(content)

	return {
		name: name.trim(),
		description: desc.trim(),
	}
}

const splitContent = (content) => {
	const lines = content.split('\n')
	const parts = [lines[0].trim()]
	lines.splice(0, 1)

	while (lines.length > 0) {
		const next = nextContent(lines)
		parts.push(next.trim())
	}

	return parts
}

const nextContent = (lines) => {
	const sb = new StringBuilder()

	sb.line(lines[0])
	let i = 1

	for (; i < lines.length; i++) {
		if (/^\s*@[a-z]+/.test(lines[i])) {
			break
		}

		sb.line(lines[i])
	}

	lines.splice(0, i)
	return sb.toString()
}

const separateNameAndDesc = (content) => {
	const [name, desc] = bifurcate(content.trim())
	return [name.trim(), desc.trim()]
}

const parseMods = (modifiers) => {
	const mods = {}

	for (const m of modifiers) {
		const [name, value] = bifurcate(m.trim())
		mods[name] = value ? value : ''
	}

	return mods
}

const parseModAlias = (mods) => {
	const exists = mods['@alias']

	if (!exists || !exists.trim()) {
		return []
	}

	return split(mods['@alias']) //
		.map((s) => s.trim())
		.filter((s) => !!s)
}

const parseModString = (mods, name, defaultValue = '') => {
	const exists = mods[name]

	if (!exists || !exists.trim()) {
		return defaultValue
	}

	return mods[name].trim()
}

const bifurcate = (s) => {
	const i = s.indexOf(' ')

	if (i === -1) {
		return [s, '']
	}

	return [s.slice(0, i), s.slice(i + 1)]
}

const split = (s) => {
	const values = []

	while (s) {
		const [next, rest] = bifurcate(s)
		values.push(next)
		s = rest
	}

	return values
}
