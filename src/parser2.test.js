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
		//slots: [],
		//context: [],
		//events: [],
	}
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
				exp.props.push({
					name: 'first',
					description: 'is the first prop.',
				})

				expect(act).toEqual(exp)
			})
		})
	})
})
