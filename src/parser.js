import p23 from 'p23'

//P24.name:
//P24.description:
//P24.module.const.<name>:
//P24.module.let.<name>:
//P24.const.<name>:
//P24.let.<name>:
//P24.slot.<name>:

export const parse = (src) => {
	return p23(src, { prefix: 'p24' }) //
		.map(trimNameAndDescription)
		.map(useFilenameIfNameMissing)
		.map(makeModuleIfMissing)
		.map(makeModuleConstIfMissing)
		.map(makeModuleLetIfMissing)
		.map(makeConstIfMissing)
		.map(makeLetIfMissing)
		.map(makeSlotIfMissing)
		.map(trimModuleConst)
		.map(trimModuleLet)
		.map(trimConst)
		.map(trimLet)
		.map(trimSlots)
		.map(groupProps)
		.map(renameSlotToSlots)
}

const trimNameAndDescription = (meta) => {
	meta.nodes.name = trimSpace(meta.nodes.name)
	meta.nodes.description = trimSpace(meta.nodes.description)
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

const trimModuleConst = (meta) => {
	for (const name in meta.nodes.module.const) {
		meta.nodes.module.const[name] = trimSpace(meta.nodes.module.const[name])
	}
	return meta
}

const trimModuleLet = (meta) => {
	for (const name in meta.nodes.module.let) {
		meta.nodes.module.let[name] = trimSpace(meta.nodes.module.let[name])
	}
	return meta
}

const trimConst = (meta) => {
	for (const name in meta.nodes.const) {
		meta.nodes.const[name] = trimSpace(meta.nodes.const[name])
	}
	return meta
}

const trimLet = (meta) => {
	for (const name in meta.nodes.let) {
		meta.nodes.let[name] = trimSpace(meta.nodes.let[name])
	}
	return meta
}

const trimSlots = (meta) => {
	for (const name in meta.nodes.slot) {
		meta.nodes.slot[name] = trimSpace(meta.nodes.slot[name])
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

export default parse
