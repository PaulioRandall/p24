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
		contexts: [],
		events: [],
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

const newCtxOrEvent = (custom) => {
	return Object.assign(
		{
			name: '',
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

		describe('name & description', () => {
			test('name only', () => {
				const act = parse(
					mockLoad({
						component: ['Alphabet'],
					})
				)

				const exp = newExpect()
				exp.name = 'Alphabet'

				expect(act).toEqual(exp)
			})

			test('description only', () => {
				const act = parse(
					mockLoad({
						component: ['\nAlphabet'],
					})
				)

				const exp = newExpect()
				exp.name = 'Weatherwax'
				exp.description = 'Alphabet'

				expect(act).toEqual(exp)
			})

			test('name & description', () => {
				const act = parse(
					mockLoad({
						component: ['Abc\nXyz'],
					})
				)

				const exp = newExpect()
				exp.name = 'Abc'
				exp.description = 'Xyz'

				expect(act).toEqual(exp)
			})

			test('multiline description', () => {
				const act = parse(
					mockLoad({
						component: ['NAME\nAlphabet\nAlphabet\nAlphabet'],
					})
				)

				const exp = newExpect()
				exp.name = 'NAME'
				exp.description = 'Alphabet\nAlphabet\nAlphabet'

				expect(act).toEqual(exp)
			})

			test('ignores mods', () => {
				const act = parse(
					mockLoad({
						component: ['NAME\nAlphabet\n@name Soup'],
					})
				)

				const exp = newExpect()
				exp.name = 'NAME'
				exp.description = 'Alphabet'

				expect(act).toEqual(exp)
			})
		})

		describe('prop', () => {
			test('name only', () => {
				const act = parse(
					mockLoad({
						prop: ['NAME'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'NAME',
						description: '',
					})
				)

				expect(act).toEqual(exp)
			})

			test('description', () => {
				const act = parse(
					mockLoad({
						prop: ['NAME\nDESC'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'NAME',
						description: 'DESC',
					})
				)

				expect(act).toEqual(exp)
			})

			test('multiple props', () => {
				const act = parse(
					mockLoad({
						prop: ['first\nThe first prop.', 'second\nThe second prop.'],
					})
				)

				const exp = newExpect()
				exp.props.push(
					newProp({
						name: 'first',
						description: 'The first prop.',
					}),
					newProp({
						name: 'second',
						description: 'The second prop.',
					})
				)

				expect(act).toEqual(exp)
			})

			test('with alias', () => {
				const act = parse(
					mockLoad({
						prop: ['first\n@alias f1 f2'],
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

			test('with empty alias', () => {
				const act = parse(
					mockLoad({
						prop: ['first\n@alias'],
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

			test('as const', () => {
				const act = parse(
					mockLoad({
						prop: ['first\n@const'],
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

			test('as module', () => {
				const act = parse(
					mockLoad({
						prop: ['first\n@module'],
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

			test('with default', () => {
				const act = parse(
					mockLoad({
						prop: ['first\n@default value'],
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

			test('with empty default', () => {
				const act = parse(
					mockLoad({
						prop: ['first\n@default'],
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
		/*
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

		describe('context', () => {
			test('is parsed with @ctx', () => {
				const act = parse(
					mockLoad({
						'@ctx': ['abc-123 holds nothing.'],
					})
				)

				const exp = newExpect()
				exp.contexts.push(
					newCtxOrEvent({
						name: 'abc-123',
						description: 'holds nothing.',
					})
				)

				expect(act).toEqual(exp)
			})
		})

		describe('events', () => {
			test('is parsed with @on', () => {
				const act = parse(
					mockLoad({
						'@on': ['load is called when the thing loads.'],
					})
				)

				const exp = newExpect()
				exp.events.push(
					newCtxOrEvent({
						name: 'load',
						description: 'is called when the thing loads.',
					})
				)

				expect(act).toEqual(exp)
			})
		})
		*/
	})
})
