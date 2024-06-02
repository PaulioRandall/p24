import { trim, clean } from './formatters.js'

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

	return result
}

const parseComponent = (result, data) => {
	result.name = data.name.split('.')[0]
	result.description = ''

	const nodes = data.nodes['@component']

	if (!nodes || nodes.length === 0) {
		return
	}

	const [desc, mods] = separateModifiers(nodes[0])
	result.description = desc

	if ('@name' in mods) {
		result.name = mods['@name']
	}
}

const parseProps = (result, data) => {
	const rawProps = data.nodes['@prop']
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
	}
}

const separateModifiers = (content) => {
	const lines = content.split('\n')
	const mods = []

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		if (/^\s*@[a-z]+/.test(line)) {
			mods.push(line)
			lines.splice(i, 1)
		}
	}

	return [
		//
		lines.join('\n').trim(),
		parseMods(mods),
	]
}

const separateNameAndDesc = (content) => {
	content = content.trim()
	const i = content.indexOf(' ')

	if (i === -1) {
		return [content, '']
	}

	return [content.slice(0, i).trim(), content.slice(i).trim()]
}

const parseMods = (modifiers) => {
	const mods = {}

	for (const m of modifiers) {
		const parts = m.trim().split(' ', 2)
		const value = parts.length > 1 ? parts[1].trim() : 'true'
		mods[parts[0]] = value
	}

	return mods
}
