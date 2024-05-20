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
	return parse({ glob: f }).map((m) => {
		m.relPath = upath.toUnix(m.relPath)
		m.absPath = upath.toUnix(m.absPath)
		return m
	})
}

describe('p24', () => {
	const INPUT_NODES_SCHEMA = {
		name: '',
		description: '',
		module: {
			// 'm'
			const: {},
			let: {},
		},
		prop: {
			// 'p'
			const: {},
			let: {},
		},
		slot: {}, // 's'
		context: {}, // 'c'
		on: {},
		default: {
			// 'd'
			name: '',
			description: '',
			module: {
				// 'm'
				const: {},
				let: {},
			},
			prop: {
				// 'p'
				const: {},
				let: {},
			},
			slot: {}, // 's'
			context: {}, // 'c'
		},
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
		events: {},
		defaults: {
			module: {
				const: {},
				let: {},
			},
			props: {
				const: {},
				let: {},
			},
			slots: {},
		},
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
				prop: {
					const: {
						name: '      ',
					},
				},
			}

			const trim = (s) => s.trim(s)
			apply(nodes, 'prop.const.name', trim)
			expect(nodes.prop.const.name).toEqual('')
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
				prop: {
					const: {
						name: uncleaned,
					},
					let: {
						name: uncleaned,
					},
				},
			}

			formatNodes(nodes)
			expect(nodes.prop.const.name).toEqual(cleaned)
			expect(nodes.prop.let.name).toEqual(cleaned)
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
		test('parses component name and description', () => {
			const file = createSvelteFilePath('NameAndDescription')
			const act = parseToUnix(file)
			const expNodes = structuredClone(OUTPUT_NODES_SCHEMA)

			expNodes.name = 'Name and Description Component'
			expNodes.description =
				'Just a simple component with a name and description.'

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: expNodes,
				},
			])
		})

		test('parses multiline description', () => {
			const file = createSvelteFilePath('MultilineDescription')
			const act = parseToUnix(file)
			const expNodes = structuredClone(OUTPUT_NODES_SCHEMA)

			expNodes.name = 'MultilineDescription'
			expNodes.description = 'a\n b\n  c'

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: expNodes,
				},
			])
		})

		test('parses component module props', () => {
			const file = createSvelteFilePath('ModuleProps')
			const act = parseToUnix(file)
			const expNodes = structuredClone(OUTPUT_NODES_SCHEMA)

			expNodes.name = 'ModuleProps'
			expNodes.module = {
				const: {
					alpha: 'Abra',
					bravo: 'Bellsprout',
				},
				let: {
					charlie: 'Clefairy',
					delta: 'Diglett',
				},
			}

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: expNodes,
				},
			])
		})

		test('parses component props', () => {
			const file = createSvelteFilePath('Props')
			const act = parseToUnix(file)
			const expNodes = structuredClone(OUTPUT_NODES_SCHEMA)

			expNodes.name = 'Props'
			expNodes.props = {
				const: {
					alpha: 'Abra',
					bravo: 'Bellsprout',
				},
				let: {
					charlie: 'Clefairy',
					delta: 'Diglett',
				},
			}

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: expNodes,
				},
			])
		})

		test('parses component slots', () => {
			const file = createSvelteFilePath('Slots')
			const act = parseToUnix(file)
			const expNodes = structuredClone(OUTPUT_NODES_SCHEMA)

			expNodes.name = 'Slots'
			expNodes.slots = {
				default: 'Mew',
				alpha: 'Abra',
				bravo: 'Bellsprout',
			}

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: expNodes,
				},
			])
		})

		test('parses component contexts', () => {
			const file = createSvelteFilePath('Context')
			const act = parseToUnix(file)
			const expNodes = structuredClone(OUTPUT_NODES_SCHEMA)

			expNodes.name = 'Context'
			expNodes.context = {
				'a-b-c': 'Abra',
				'x-y-z': 'Bellsprout',
			}

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: expNodes,
				},
			])
		})

		test('parses component events', () => {
			const file = createSvelteFilePath('Event')
			const act = parseToUnix(file)
			const expNodes = structuredClone(OUTPUT_NODES_SCHEMA)

			expNodes.name = 'Event'
			expNodes.events = {
				custom: 'Eat my shorts.',
				another: 'Dental plan! Lisa needs braces!',
			}

			expect(act).toEqual([
				{
					...generateFileFields(file),
					nodes: expNodes,
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
						events: {
							selected: 'Fired when this item is selected.',
						},
						defaults: {
							module: {
								const: {},
								let: {},
							},
							props: {
								const: {
									func: '{}',
								},
								let: {
									published: 'null',
								},
							},
							slots: {
								default: '"No description".',
							},
						},
					},
				},
			])
		})
	})
})
