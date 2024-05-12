import p23 from 'p23'
import { trim, clean } from './formatters.js'

//P24.name:
//P24.description:
//P24.module.const.<name>:
//P24.module.let.<name>:
//P24.props.const.<name>:
//P24.props.let.<name>:
//P24.slot.<name>:
//P24.context.<name>:

//P24.name:
//P24.desc:
//P24.m.c.<name>:
//P24.m.l.<name>:
//P24.p.c.<name>:
//P24.p.l.<name>:
//P24.s.<name>:
//P24.c.<name>:

//P24.default.module.const.<name>:
//P24.default.module.let.<name>:
//P24.default.props.const.<name>:
//P24.default.props.let.<name>:
//P24.default.slot.<name>:

//P24.d.m.c.<name>:
//P24.d.m.l.<name>:
//P24.d.p.c.<name>:
//P24.d.p.l.<name>:
//P24.d.s.<name>:

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
	apply(nodes, 'name', trim)

	createMissingNode(nodes, 'description', '')
	apply(nodes, 'description', clean)

	createMissingNode(nodes, 'default', {})

	createMissingNode(nodes, 'module', {})
	createMissingNode(nodes, 'module.const', {})
	createMissingNode(nodes, 'module.let', {})
	createMissingNode(nodes, 'default.module', {})
	createMissingNode(nodes, 'default.module.const', {})
	createMissingNode(nodes, 'default.module.let', {})
	mergeNodes(nodes, 'm', 'module')
	mergeNodes(nodes, 'module.c', 'module.const')
	mergeNodes(nodes, 'module.l', 'module.let')
	applyToAll(nodes, 'module.const', clean)
	applyToAll(nodes, 'module.let', clean)
	applyToAll(nodes, 'default.module.const', clean)
	applyToAll(nodes, 'default.module.let', clean)

	createMissingNode(nodes, 'prop', {})
	createMissingNode(nodes, 'prop.const', {})
	createMissingNode(nodes, 'prop.let', {})
	createMissingNode(nodes, 'default.prop', {})
	createMissingNode(nodes, 'default.prop.const', {})
	createMissingNode(nodes, 'default.prop.let', {})
	mergeNodes(nodes, 'p', 'prop')
	mergeNodes(nodes, 'prop.c', 'prop.const')
	mergeNodes(nodes, 'prop.l', 'prop.let')
	applyToAll(nodes, 'prop.const', clean)
	applyToAll(nodes, 'prop.let', clean)
	applyToAll(nodes, 'default.prop.const', clean)
	applyToAll(nodes, 'default.prop.let', clean)

	createMissingNode(nodes, 'slot', {})
	createMissingNode(nodes, 'default.slot', {})
	applyToAll(nodes, 'slot', clean)
	applyToAll(nodes, 'default.slot', clean)

	createMissingNode(nodes, 'context', {})
	applyToAll(nodes, 'context', clean)
}

const createMissingNode = (nodes, path, defaultValue = undefined) => {
	const [parents, field] = findParentsAndField(path)
	const parentObj = getParentObject(nodes, parents)

	if (!(field in parentObj)) {
		parentObj[field] = defaultValue
	}
}

const mergeNodes = (nodes, src, dst) => {
	const [dstParents, dstField] = findParentsAndField(dst)
	const dstParentObj = getParentObject(nodes, dstParents)
	const dstObj = dstParentObj[dstField]

	const [srcParents, srcField] = findParentsAndField(src)
	const srcParentObj = getParentObject(nodes, srcParents)
	const srcObj = srcParentObj[srcField]

	for (const key in srcObj) {
		dstObj[key] = srcObj[key]
	}

	delete srcParentObj[srcField]
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
