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
	return p23(src, { prefix: 'p24' }) //
		.map(formatNodes)
		.map(useFilenameIfNameMissing)
		.map(groupProps)
		.map(renameSlotToSlots)
}

export const formatNodes = (meta) => {
	createMissingNodes(meta.nodes)

	apply(meta.nodes, 'name', trim)
	apply(meta.nodes, 'description', clean)
	applyToAll(meta.nodes, 'module.const', clean)
	applyToAll(meta.nodes, 'module.let', clean)
	applyToAll(meta.nodes, 'const', clean)
	applyToAll(meta.nodes, 'let', clean)
	applyToAll(meta.nodes, 'slot', clean)
	applyToAll(meta.nodes, 'context', clean)

	return meta
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

const useFilenameIfNameMissing = (meta) => {
	if (!meta.nodes.name) {
		meta.nodes.name = meta.name.split('.')[0]
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
