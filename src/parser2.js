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

	if ('name' in mods) {
		result.name = mods.name
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

const parseMods = (modifiers) => {
	const mods = {}

	for (const m of modifiers) {
		m = m.trim()
		const parts = m.split(' ', 1)

		const value = parts.length > 1 ? parts[1] : true
		mods[name] = value
	}

	return mods
}
