import parse from './parser2.js'

const mockLoad = (nodes) => {
	return {
		name: `Weatherwax.svelte`,
		relPath: `./discworld/Weatherwax.svelte`,
		absPath: `/user/esmerelda/projects/discworld/Weatherwax.svelte`,
		nodes,
	}
}

describe('parser.js', () => {
	describe('parse', () => {
		test('no data', () => {
			const act = parse(mockLoad({}))

			const exp = {
				name: 'Weatherwax',
				description: '',
			}

			expect(act).toEqual(exp)
		})

		describe('description', () => {
			test('is parsed', () => {
				const act = parse(
					mockLoad({
						'@component': ['Alphabet'],
					})
				)

				const exp = {
					name: 'Weatherwax',
					description: 'Alphabet',
				}

				expect(act).toEqual(exp)
			})

			test('is parsed with all lines', () => {
				const act = parse(
					mockLoad({
						'@component': ['Alphabet\nAlphabet\nAlphabet'],
					})
				)

				const exp = {
					name: 'Weatherwax',
					description: 'Alphabet\nAlphabet\nAlphabet',
				}

				expect(act).toEqual(exp)
			})

			test('is parsed with custom name', () => {
				const act = parse(
					mockLoad({
						'@component': ['Alphabet\n@name Soup'],
					})
				)

				const exp = {
					name: 'Soup',
					description: 'Alphabet',
				}

				expect(act).toEqual(exp)
			})
		})
	})
})
