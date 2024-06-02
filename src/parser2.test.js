import parse from './parser2.js'

const mockLoad = (nodes) => {
	return {
		name: `Weatherwax.svelte`,
		relPath: `./discworld/Weatherwax.svelte`,
		absPath: `/user/esmerelda/projects/discworld/Weatherwax.svelte`,
		nodes,
	}
}

const newExpect = () => {
	return {
		name: 'Weatherwax',
		description: '',
		props: [],
		slots: [],
		//context: [],
		//events: [],
	}
}

const newProp = (custom) => {
	return Object.assign(
		{
			name: '',
			description: '',
			alias: [],
			const: false,
			module: false,
			default: '',
		},
		custom
	)
}

const newSlot = (custom) => {
	return Object.assign(
		{
			name: 'default',
			description: '',
		},
		custom
	)
}

describe('parser.js', () => {
	describe('parse', () => {
		test('no data', () => {
			const act = parse(mockLoad({}))

			const exp = newExpect()

			expect(act).toEqual(exp)
		})

		describe('description', () => {
			test('is parsed', () => {
				const act = parse(
					mockLoad({
						'@component': ['Alphabet'],
					})
				)

				const exp = newExpect()
				exp.description = 'Alphabet'

				expect(act).toEqual(exp)
			})

			test('is parsed with all lines', () => {
				const act = parse(
					mockLoad({
						'@component': ['Alphabet\nAlphabet\nAlphabet'],
					})
				)

				const exp = newExpect()
				exp.description = 'Alphabet\nAlphabet\nAlphabet'

				expect(act).toEqual(exp)
			})

			test('is parsed with custom name', () => {
				const act = parse(
					mockLoad({
						'@component': ['Alphabet\n@name Soup'],
					})
				)

				const exp = newExpect()
				exp.name = 'Soup'
				exp.description = 'Alphabet'

				expect(act).toEqual(exp)
			})
		})

		describe('prop', () => {
			test('is parsed with name and description', () => {
				const act = parse(
					mockLoad({
						'@prop': ['first is the first prop.'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'first',
						description: 'is the first prop.',
					})
				)

				expect(act).toEqual(exp)
			})

			test('is parsed with name only', () => {
				const act = parse(
					mockLoad({
						'@prop': ['first'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'first',
					})
				)

				expect(act).toEqual(exp)
			})

			test('is parsed with name only', () => {
				const act = parse(
					mockLoad({
						'@prop': ['first is the first prop.', 'second is the second prop.'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'first',
						description: 'is the first prop.',
					}),
					newProp({
						name: 'second',
						description: 'is the second prop.',
					})
				)

				expect(act).toEqual(exp)
			})

			test('is parsed with @alias', () => {
				const act = parse(
					mockLoad({
						'@prop': ['first\n@alias f1 f2'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'first',
						alias: ['f1', 'f2'],
					})
				)

				expect(act).toEqual(exp)
			})

			test('is parsed with empty @alias', () => {
				const act = parse(
					mockLoad({
						'@prop': ['first\n@alias'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'first',
						alias: [],
					})
				)

				expect(act).toEqual(exp)
			})

			test('is parsed with @const', () => {
				const act = parse(
					mockLoad({
						'@prop': ['first\n@const'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'first',
						const: true,
					})
				)

				expect(act).toEqual(exp)
			})

			test('is parsed with @module', () => {
				const act = parse(
					mockLoad({
						'@prop': ['first\n@module'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'first',
						module: true,
					})
				)

				expect(act).toEqual(exp)
			})

			test('is parsed with @default', () => {
				const act = parse(
					mockLoad({
						'@prop': ['first\n@default value'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'first',
						default: 'value',
					})
				)

				expect(act).toEqual(exp)
			})

			test('is parsed with empty @default', () => {
				const act = parse(
					mockLoad({
						'@prop': ['first\n@default'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'first',
						default: '',
					})
				)

				expect(act).toEqual(exp)
			})
		})

		describe('slot', () => {
			test('is parsed with @slot', () => {
				const act = parse(
					mockLoad({
						'@slot': ['The default slot.'],
					})
				)

				const exp = newExpect()
				exp.slots.push(
					newSlot({
						description: 'The default slot.',
					})
				)

				expect(act).toEqual(exp)
			})

			test('is parsed with @name modifier', () => {
				const act = parse(
					mockLoad({
						'@slot': ['A named slot.\n@name content'],
					})
				)

				const exp = newExpect()
				exp.slots.push(
					newSlot({
						name: 'content',
						description: 'A named slot.',
					})
				)

				expect(act).toEqual(exp)
			})
		})
	})
})
