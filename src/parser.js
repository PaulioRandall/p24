import p23, { cleanFileNode } from 'p23'
import { trim, clean } from './formatters.js'

//P24.name:
//P24.description:
//P24.module.const.<name>:
//P24.module.let.<name>:
//P24.prop.const.<name>:
//P24.prop.let.<name>:
//P24.slot.<name>:
//P24.context.<name>:
//P24.event.<name>:

//P24.name:
//P24.desc:
//P24.m.const.<name>:
//P24.m.let.<name>:
//P24.p.const.<name>:
//P24.p.let.<name>:
//P24.ctx.<name>:
//P24.on.<name>:

//P24.default.module.const.<name>:
//P24.default.module.let.<name>:
//P24.default.prop.const.<name>:
//P24.default.prop.let.<name>:
//P24.default.slot.<name>:

//P24.d.m.const.<name>:
//P24.d.m.let.<name>:
//P24.d.p.const.<name>:
//P24.d.p.let.<name>:
//P24.d.slot.<name>:

export default (options = {}) => {
	options = parseOptions(options)
	return p23(options) //
		.map(cleanFileNode)
		.map(oneValuePerNode)
		.map(formatMeta)
}

const parseOptions = (userOptions) => {
	return {
		// glob: '**/*.svelte',
		prefix: 'p24.',
		...userOptions,
	}
}

const oneValuePerNode = (m) => {
	useLastValueInEachNode(m.nodes)
	return m
}

const useLastValueInEachNode = (nodes) => {
	for (const name in nodes) {
		const n = nodes[name]

		if (isObject(n)) {
			useLastValueInEachNode(n)
		} else {
			nodes[name] = n[n.length - 1]
		}
	}
}

const formatMeta = (m) => {
	formatNodes(m.nodes)
	useDefaultNameIfNameMissing(m.nodes, m.name.split('.')[0])
	return m
}

export const formatNodes = (nodes) => {
	createMissingNode(nodes, 'name', '')
	apply(nodes, 'name', trim)

	createMissingNode(nodes, 'description', '')
	applyValueMerge(nodes, 'desc', 'description')
	apply(nodes, 'description', clean)

	createMissingNode(nodes, 'default', {})
	applyNodeMerge(nodes, 'd', 'default')

	createMissingNode(nodes, 'module', {})
	createMissingNode(nodes, 'module.const', {})
	createMissingNode(nodes, 'module.let', {})
	applyNodeMerge(nodes, 'm', 'module')
	applyToAll(nodes, 'module.const', clean)
	applyToAll(nodes, 'module.let', clean)

	createMissingNode(nodes, 'default.module', {})
	createMissingNode(nodes, 'default.module.const', {})
	createMissingNode(nodes, 'default.module.let', {})
	applyNodeMerge(nodes, 'default.m', 'default.module')
	applyToAll(nodes, 'default.module.const', clean)
	applyToAll(nodes, 'default.module.let', clean)

	createMissingNode(nodes, 'prop', {})
	createMissingNode(nodes, 'prop.const', {})
	createMissingNode(nodes, 'prop.let', {})
	applyNodeMerge(nodes, 'p', 'prop')
	applyToAll(nodes, 'prop.const', clean)
	applyToAll(nodes, 'prop.let', clean)

	createMissingNode(nodes, 'default.prop', {})
	createMissingNode(nodes, 'default.prop.const', {})
	createMissingNode(nodes, 'default.prop.let', {})
	applyNodeMerge(nodes, 'default.p', 'default.prop')
	applyToAll(nodes, 'default.prop.const', clean)
	applyToAll(nodes, 'default.prop.let', clean)

	createMissingNode(nodes, 'slot', {})
	applyToAll(nodes, 'slot', clean)

	createMissingNode(nodes, 'default.slot', {})
	applyToAll(nodes, 'default.slot', clean)

	createMissingNode(nodes, 'context', {})
	applyNodeMerge(nodes, 'ctx', 'context')
	applyToAll(nodes, 'context', clean)

	createMissingNode(nodes, 'event', {})
	applyNodeMerge(nodes, 'on', 'event')
	applyToAll(nodes, 'event', clean)
}

const createMissingNode = (nodes, path, defaultValue = undefined) => {
	const [parents, field] = findParentsAndField(path)
	const parentObj = getParentObject(nodes, parents)

	if (!(field in parentObj)) {
		parentObj[field] = defaultValue
	}
}

const applyValueMerge = (nodes, src, dst) => {
	const [dstParents, dstField] = findParentsAndField(dst)
	const dstParentObj = getParentObject(nodes, dstParents)

	const [srcParents, srcField] = findParentsAndField(src)
	const srcParentObj = getParentObject(nodes, srcParents)
	const srcVal = srcParentObj[srcField]

	if (srcVal) {
		dstParentObj[dstField] = srcVal
		delete srcParentObj[srcField]
	}
}

const applyNodeMerge = (nodes, src, dst) => {
	const [dstParents, dstField] = findParentsAndField(dst)
	const dstParentObj = getParentObject(nodes, dstParents)
	const dstObj = dstParentObj[dstField]

	const [srcParents, srcField] = findParentsAndField(src)
	const srcParentObj = getParentObject(nodes, srcParents)
	const srcObj = srcParentObj[srcField]

	if (srcObj) {
		for (const key in srcObj) {
			if (isObject(dstObj[key])) {
				mergeNodes(dstObj[key], srcObj[key])
			} else {
				dstObj[key] = srcObj[key]
			}
		}
	}

	delete srcParentObj[srcField]
}

const mergeNodes = (dst, src) => {
	for (const k in src) {
		if (isObject(dst[k]) && isObject(src[k])) {
			mergeNodes(dst[k], src[k])
		} else {
			dst[k] = src[k]
		}
	}

	return dst
}

const isObject = (v) => {
	return !!v && typeof v === 'object' && !Array.isArray(v)
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

const useDefaultNameIfNameMissing = (nodes, defaultName) => {
	if (!nodes.name) {
		nodes.name = defaultName
	}
}
