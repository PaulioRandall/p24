import upath from 'upath'
import parse, { formatNodes, findParentsAndField, apply } from './parser.js'

const testdataDir = './src/testdata'

const createSvelteFilePath = (filename) => {
	return upath.join(`${testdataDir}/files/${filename}.svelte`)
}

const generateFileFields = (file) => {
	return {
		name: upath.basename(file),
		relPath: upath.join(file),
		absPath: upath.resolve(file),
	}
}

const parseToUnix = (f) => {
	return parse(f).map((m) => {
		m.relPath = upath.toUnix(m.relPath)
		m.absPath = upath.toUnix(m.absPath)
		return m
	})
}

describe('p24', () => {
	//P24.name:
	//P24.description:
	//P24.module.const.<name>:
	//P24.module.let.<name>:
	//P24.const.<name>:
	//P24.let.<name>:
	//P24.slot.<name>:
	//P24.context.<name>:

	const INPUT_NODES_SCHEMA = {
		name: '',
		description: '',
		module: {
			const: {},
			let: {},
		},
		const: {},
		let: {},
		slot: {},
		context: {},
	}

	const OUTPUT_NODES_SCHEMA = {
		name: '',
		description: '',
		module: {
			const: {},
			let: {},
		},
		props: {
			const: {},
			let: {},
		},
		slots: {},
		context: {},
	}

	describe('findParentsAndField', () => {
		test('no parents', () => {
			const [parents, field] = findParentsAndField('name')
			expect(parents).toEqual(expect.arrayContaining([]))
			expect(field).toEqual('name')
		})

		test('some parents', () => {
			const [parents, field] = findParentsAndField('props.const.name')
			expect(parents).toEqual(expect.arrayContaining(['props', 'const']))
			expect(field).toEqual('name')
		})
	})

	describe('apply', () => {
		test('applies as expected', () => {
			const nodes = {
				props: {
					const: {
						name: '      ',
					},
				},
			}

			const trim = (s) => s.trim(s)
			apply(nodes, 'props.const.name', trim)
			expect(nodes.props.const.name).toEqual('')
		})
	})

	describe('formatNodes', () => {
		const uncleaned = '  \n  abc  \n    xyz  \n  '
		const cleaned = 'abc\n  xyz'

		test('trims name', () => {
			const nodes = {
				name: ' abc ',
			}
			formatNodes(nodes)
			expect(nodes.name).toEqual('abc')
		})

		test('cleans description', () => {
			const nodes = {
				description: uncleaned,
			}
			formatNodes(nodes)
			expect(nodes.description).toEqual(cleaned)
		})

		test('cleans module props', () => {
			const nodes = {
				module: {
					const: {
						name: uncleaned,
					},
					let: {
						name: uncleaned,
					},
				},
			}

			formatNodes(nodes)
			expect(nodes.module.const.name).toEqual(cleaned)
			expect(nodes.module.let.name).toEqual(cleaned)
		})

		test('cleans props', () => {
			const nodes = {
				const: {
					name: uncleaned,
				},
				let: {
					name: uncleaned,
				},
			}

			formatNodes(nodes)
			expect(nodes.const.name).toEqual(cleaned)
			expect(nodes.let.name).toEqual(cleaned)
		})

		test('cleans slots', () => {
			const nodes = {
				slot: {
					name: uncleaned,
				},
			}

			formatNodes(nodes)
			expect(nodes.slot.name).toEqual(cleaned)
		})

		test('cleans context', () => {
			const nodes = {
				context: {
					name: uncleaned,
				},
			}
			formatNodes(nodes)
			expect(nodes.context.name).toEqual(cleaned)
		})
	})

	describe('parse', () => {
		//P24.name:
		//P24.description:
		//P24.module.const.<name>:
		//P24.module.let.<name>:
		//P24.const.<name>:
		//P24.let.<name>:
		//P24.slot.<name>:
		//P24.context.<name>:

		test('parses component name and description', () => {
			const file = createSvelteFilePath('NameAndDescription')
			const act = parseToUnix(file)

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						name: 'Name and Description Component',
						description: 'Just a simple component with a name and description.',
						module: {
							const: {},
							let: {},
						},
						props: {
							const: {},
							let: {},
						},
						slots: {},
						context: {},
					},
				},
			])
		})

		test('parses multiline description', () => {
			const file = createSvelteFilePath('MultilineDescription')
			const act = parseToUnix(file)

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						name: 'MultilineDescription',
						description: 'a\n b\n  c',
						module: {
							const: {},
							let: {},
						},
						props: {
							const: {},
							let: {},
						},
						slots: {},
						context: {},
					},
				},
			])
		})

		test('parses component module props', () => {
			const file = createSvelteFilePath('ModuleProps')
			const act = parseToUnix(file)

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						name: 'ModuleProps',
						description: '',
						module: {
							const: {
								abc: '123',
							},
							let: {
								xyz: '789',
							},
						},
						props: {
							const: {},
							let: {},
						},
						slots: {},
						context: {},
					},
				},
			])
		})

		test('parses component props', () => {
			const file = createSvelteFilePath('Props')
			const act = parseToUnix(file)

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						name: 'Props',
						description: '',
						module: {
							const: {},
							let: {},
						},
						props: {
							const: {
								abc: '123',
							},
							let: {
								xyz: '789',
							},
						},
						slots: {},
						context: {},
					},
				},
			])
		})

		test('parses component slots', () => {
			const file = createSvelteFilePath('Slots')
			const act = parseToUnix(file)

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						name: 'Slots',
						description: '',
						module: {
							const: {},
							let: {},
						},
						props: {
							const: {},
							let: {},
						},
						slots: {
							default: 'Meh',
							abc: '123',
							xyz: '789',
						},
						context: {},
					},
				},
			])
		})

		test('parses component contexts', () => {
			const file = createSvelteFilePath('Context')
			const act = parseToUnix(file)

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						name: 'Context',
						description: '',
						module: {
							const: {},
							let: {},
						},
						props: {
							const: {},
							let: {},
						},
						slots: {},
						context: {
							'a-b-c': '123',
							'x-y-z': '789',
						},
					},
				},
			])
		})

		test('parses fully documented component', () => {
			const file = createSvelteFilePath('AlbumListItem')
			const act = parseToUnix(file)

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						name: 'AlbumListItem',
						description:
							'Details about an album. Designed to be used within a grid or flex grid.',
						module: {
							const: {
								genres: 'List of allowable genres.',
							},
							let: {
								formatDate: 'Formats any dates, defaults to DD/MM/YYYY.',
							},
						},
						props: {
							const: {
								func: 'A random function to bind on that does nothing.',
							},
							let: {
								title: 'Title of the album.',
								artist: 'Artist or band who created the album.',
								published:
									'If known, the published date of the album in the format YYYY-MM-DD.',
							},
						},
						slots: {
							default: 'A description of the album.',
						},
						context: {
							'album-title': 'See title prop.',
							'album-artist': 'See artist prop.',
						},
					},
				},
			])
		})
	})
})
