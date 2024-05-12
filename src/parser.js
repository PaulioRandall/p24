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

//P24.default.name:
//P24.default.description:
//P24.default.module.const.<name>:
//P24.default.module.let.<name>:
//P24.default.const.<name>:
//P24.default.let.<name>:
//P24.default.slot.<name>:
//P24.default.context.<name>:

export default (src) => {
	return p23(src, { prefix: 'p24' }).map(formatMeta)
}

const formatMeta = (m) => {
	formatNodes(m.nodes)
	renamePropToProps(m.nodes)
	renameSlotToSlots(m.nodes)
	renameDefaultToDefaults(m.nodes)
	useDefaultNameIfNameMissing(m.nodes, m.name.split('.')[0])
	return m
}

export const formatNodes = (nodes) => {
	createMissingNode(nodes, 'name', '')
	createMissingNode(nodes, 'description', '')
	createMissingNode(nodes, 'module', {})
	createMissingNode(nodes, 'module.const', {})
	createMissingNode(nodes, 'module.let', {})
	createMissingNode(nodes, 'prop', {})
	createMissingNode(nodes, 'prop.const', {})
	createMissingNode(nodes, 'prop.let', {})
	createMissingNode(nodes, 'slot', {})
	createMissingNode(nodes, 'context', {})

	apply(nodes, 'name', trim)
	apply(nodes, 'description', clean)
	applyToAll(nodes, 'module.const', clean)
	applyToAll(nodes, 'module.let', clean)
	applyToAll(nodes, 'prop.const', clean)
	applyToAll(nodes, 'prop.let', clean)
	applyToAll(nodes, 'slot', clean)
	applyToAll(nodes, 'context', clean)

	createMissingNode(nodes, 'default', {})
	createMissingNode(nodes, 'default.module', {})
	createMissingNode(nodes, 'default.module.const', {})
	createMissingNode(nodes, 'default.module.let', {})
	createMissingNode(nodes, 'default.prop', {})
	createMissingNode(nodes, 'default.prop.const', {})
	createMissingNode(nodes, 'default.prop.let', {})
	createMissingNode(nodes, 'default.slot', {})

	applyToAll(nodes, 'default.module.const', clean)
	applyToAll(nodes, 'default.module.let', clean)
	applyToAll(nodes, 'default.prop.const', clean)
	applyToAll(nodes, 'default.prop.let', clean)
	applyToAll(nodes, 'default.slot', clean)
}

const createMissingNode = (nodes, path, defaultValue = undefined) => {
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

	nodes.default.props = {
		const: nodes.default.const,
		let: nodes.default.let,
	}

	delete nodes.default.const
	delete nodes.default.let
}

const renamePropToProps = (nodes) => {
	nodes.props = nodes.prop
	delete nodes.prop

	nodes.default.props = nodes.default.prop
	delete nodes.default.prop
}

const renameSlotToSlots = (nodes) => {
	nodes.slots = nodes.slot
	delete nodes.slot

	nodes.default.slots = nodes.default.slot
	delete nodes.default.slot
}

const renameDefaultToDefaults = (nodes) => {
	nodes.defaults = nodes.default
	delete nodes.default
}

const useDefaultNameIfNameMissing = (nodes, defaultName) => {
	if (!nodes.name) {
		nodes.name = defaultName
	}
}
