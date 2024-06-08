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

	const parts = splitContent(component[0])
	result.name = parts.name || result.name
	result.description = parts.desc || ''
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
	const parts = splitContent(rawProp)

	return {
		name: parts.name,
		description: parts.desc,
		alias: split(parts.mods.alias || '').map((s) => s.trim()),
		const: 'const' in parts.mods,
		module: 'module' in parts.mods,
		default: parts.mods.default?.trim() || '',
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
	const parts = {
		name: '',
		desc: '',
		mods: {},
	}

	// Name
	parts.name = lines[0].trim()
	lines.splice(0, 1)

	// Description
	if (lines.length > 0 && !beginsNewMod(lines[0])) {
		const next = nextContent(lines)
		parts.desc = next.trim()
	}

	// Mods
	while (lines.length > 0) {
		const next = nextContent(lines)
		const [name, value] = bifurcate(next.trim())
		parts.mods[name.slice(1).trim()] = value.trim()
	}

	return parts
}

const beginsNewMod = (s) => {
	return /^\s*@[a-z]+/.test(s)
}

const nextContent = (lines) => {
	const sb = new StringBuilder()

	sb.line(lines[0])
	let i = 1

	for (; i < lines.length; i++) {
		if (beginsNewMod(lines[i])) {
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

const bifurcate = (s) => {
	const i = s.search(/\s/)

	if (i === -1) {
		return [s, '']
	}

	return [
		//
		s.slice(0, i).trim(),
		s.slice(i).trim(),
	]
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
