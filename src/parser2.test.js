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
		test('', () => {
			const act = parse(mockLoad({}))

			const exp = {
				name: 'Weatherwax',
				description: '',
			}

			expect(act).toEqual(exp)
		})

		test('', () => {
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
	})
})
