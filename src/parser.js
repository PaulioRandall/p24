import p23 from 'p23'
import { trim, clean } from './formatters.js'

//P24.name:
//P24.description:
//P24.module.const.<name>:
//P24.module.let.<name>:
//P24.const.<name>:
//P24.let.<name>:
//P24.slot.<name>:
//P24.context.<name>:

export const formatNodes = (nodes) => {
	createMissingNodes(nodes)

	apply(nodes, 'name', trim)
	apply(nodes, 'description', clean)
	applyToAll(nodes, 'module.const', clean)
	applyToAll(nodes, 'module.let', clean)
	applyToAll(nodes, 'const', clean)
	applyToAll(nodes, 'let', clean)
	applyToAll(nodes, 'slot', clean)
	applyToAll(nodes, 'context', clean)
}

const createMissingNodes = (nodes) => {
	createMissingNode(nodes, 'name', '')
	createMissingNode(nodes, 'description', '')
	createMissingNode(nodes, 'module', {})
	createMissingNode(nodes, 'module.const', {})
	createMissingNode(nodes, 'module.let', {})
	createMissingNode(nodes, 'const', {})
	createMissingNode(nodes, 'let', {})
	createMissingNode(nodes, 'slot', {})
	createMissingNode(nodes, 'context', {})
}

const createMissingNode = (nodes, path, defaultValue) => {
	const [parents, field] = findParentsAndField(path)
	const parentObj = getParentObject(nodes, parents)

	if (!parentObj) {
		console.log(path, parents, field)
	}

	if (!(field in parentObj)) {
		parentObj[field] = defaultValue
	}
}

export const apply = (nodes, path, func) => {
	const [parents, field] = findParentsAndField(path)
	const parentObj = getParentObject(nodes, parents)
	parentObj[field] = func(parentObj[field])
}

export const applyToAll = (nodes, path, func) => {
	const [parents, field] = findParentsAndField(path)
	const parentOfParentObj = getParentObject(nodes, parents)
	const parentObj = parentOfParentObj[field]

	for (const key in parentObj) {
		parentObj[key] = func(parentObj[key])
	}
}

export const findParentsAndField = (path) => {
	const parents = path.split('.')
	const lastIdx = parents.length - 1
	const field = parents[lastIdx]
	parents.splice(lastIdx)
	return [parents, field]
}

const getParentObject = (nodes, path) => {
	let parent = nodes
	for (const p of path) {
		parent = parent[p]
	}
	return parent
}

export default (src) => {
	const meta = p23(src, { prefix: 'p24' })

	for (const m of meta) {
		formatNodes(m.nodes)
	}

	//useFilenameIfNameMissing(meta)
	//groupProps(meta)
	//renameSlotToSlots(meta)

	return p23(src, { prefix: 'p24' })
		.map(trimNameAndDescription)
		.map(useFilenameIfNameMissing)
		.map(makeModuleIfMissing)
		.map(makeModuleConstIfMissing)
		.map(makeModuleLetIfMissing)
		.map(makeConstIfMissing)
		.map(makeLetIfMissing)
		.map(makeSlotIfMissing)
		.map(makeContextIfMissing)
		.map(trimModuleConst)
		.map(trimModuleLet)
		.map(trimConst)
		.map(trimLet)
		.map(trimSlots)
		.map(trimContext)
		.map(groupProps)
		.map(renameSlotToSlots)
}

const trimNameAndDescription = (meta) => {
	meta.nodes.name = trimSpace(meta.nodes.name)

	meta.nodes.description = cleanStringNode(meta.nodes.description)
	return meta
}

const useFilenameIfNameMissing = (meta) => {
	if (!meta.nodes.name) {
		meta.nodes.name = meta.name.split('.')[0]
	}
	return meta
}

const makeModuleIfMissing = (meta) => {
	if (typeof meta.nodes.module !== 'object') {
		meta.nodes.module = {}
	}
	return meta
}

const makeModuleConstIfMissing = (meta) => {
	if (typeof meta.nodes.module.const !== 'object') {
		meta.nodes.module.const = {}
	}
	return meta
}

const makeModuleLetIfMissing = (meta) => {
	if (typeof meta.nodes.module.let !== 'object') {
		meta.nodes.module.let = {}
	}
	return meta
}

const makeConstIfMissing = (meta) => {
	if (typeof meta.nodes.const !== 'object') {
		meta.nodes.const = {}
	}
	return meta
}

const makeLetIfMissing = (meta) => {
	if (typeof meta.nodes.let !== 'object') {
		meta.nodes.let = {}
	}
	return meta
}

const makeSlotIfMissing = (meta) => {
	if (typeof meta.nodes.slot !== 'object') {
		meta.nodes.slot = {}
	}
	return meta
}

const makeContextIfMissing = (meta) => {
	if (typeof meta.nodes.context !== 'object') {
		meta.nodes.context = {}
	}
	return meta
}

const trimModuleConst = (meta) => {
	for (const name in meta.nodes.module.const) {
		meta.nodes.module.const[name] = cleanStringNode(
			meta.nodes.module.const[name]
		)
	}
	return meta
}

const trimModuleLet = (meta) => {
	for (const name in meta.nodes.module.let) {
		meta.nodes.module.let[name] = cleanStringNode(meta.nodes.module.let[name])
	}
	return meta
}

const trimConst = (meta) => {
	for (const name in meta.nodes.const) {
		meta.nodes.const[name] = cleanStringNode(meta.nodes.const[name])
	}
	return meta
}

const trimLet = (meta) => {
	for (const name in meta.nodes.let) {
		meta.nodes.let[name] = cleanStringNode(meta.nodes.let[name])
	}
	return meta
}

const trimSlots = (meta) => {
	for (const name in meta.nodes.slot) {
		meta.nodes.slot[name] = cleanStringNode(meta.nodes.slot[name])
	}
	return meta
}

const trimContext = (meta) => {
	for (const name in meta.nodes.context) {
		meta.nodes.context[name] = cleanStringNode(meta.nodes.context[name])
	}
	return meta
}

const groupProps = (meta) => {
	meta.nodes.props = {
		const: meta.nodes.const,
		let: meta.nodes.let,
	}

	delete meta.nodes.const
	delete meta.nodes.let

	return meta
}

const renameSlotToSlots = (meta) => {
	meta.nodes.slots = meta.nodes.slot
	delete meta.nodes.slot
	return meta
}

const trimSpace = (s) => {
	return typeof s === 'string' ? s.trim() : ''
}

const cleanStringNode = (node) => {
	if (!node) {
		return ''
	}

	const lines = node
		.replace(/\r/g, '')
		.split('\n')
		.map((l) => l.replace(/\s+$/, ''))

	// Filter empty lines at start
	while (lines.length > 0 && lines[0].trim() === '') {
		lines.splice(0, 1)
	}

	// Filter empty lines at end
	while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
		lines.splice(lines.length - 1, 1)
	}

	if (lines.length === 0) {
		return ''
	}

	const matches = lines[0].match(/^\s+/)
	if (!matches) {
		return lines.join()
	}

	const indent = matches[0]

	return lines
		.map((l) => {
			return l.startsWith(indent) ? l.slice(indent.length) : ''
		})
		.join('\n')
}
