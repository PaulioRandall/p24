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

export default (src) => {
	return p23(src, { prefix: 'p24' }).map(formatMeta)
}

const formatMeta = (m) => {
	formatNodes(m.nodes)
	groupProps(m.nodes)
	renameSlotToSlots(m.nodes)
	useDefaultNameIfNameMissing(m.nodes, m.name.split('.')[0])
	return m
}

export const formatNodes = (nodes) => {
	createMissingNode(nodes, 'name', '')
	createMissingNode(nodes, 'description', '')
	createMissingNode(nodes, 'module', {})
	createMissingNode(nodes, 'module.const', {})
	createMissingNode(nodes, 'module.let', {})
	createMissingNode(nodes, 'const', {})
	createMissingNode(nodes, 'let', {})
	createMissingNode(nodes, 'slot', {})
	createMissingNode(nodes, 'context', {})

	apply(nodes, 'name', trim)
	apply(nodes, 'description', clean)
	applyToAll(nodes, 'module.const', clean)
	applyToAll(nodes, 'module.let', clean)
	applyToAll(nodes, 'const', clean)
	applyToAll(nodes, 'let', clean)
	applyToAll(nodes, 'slot', clean)
	applyToAll(nodes, 'context', clean)
}

const createMissingNode = (nodes, path, defaultValue) => {
	const [parents, field] = findParentsAndField(path)
	const parentObj = getParentObject(nodes, parents)

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

const groupProps = (nodes) => {
	nodes.props = {
		const: nodes.const,
		let: nodes.let,
	}

	delete nodes.const
	delete nodes.let
}

const renameSlotToSlots = (nodes) => {
	nodes.slots = nodes.slot
	delete nodes.slot
}

const useDefaultNameIfNameMissing = (nodes, defaultName) => {
	if (!nodes.name) {
		nodes.name = defaultName
	}
}
