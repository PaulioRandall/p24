import htmlStringify from './html_stringify.js'

const lines = (...lines) => lines.join('\n')

describe('html_stringify.js', () => {
	test('Name only', () => {
		const node = {
			name: 'Component',
		}

		const act = htmlStringify(node)
		const exp = lines(
			'```svelte',
			'<Component />', //
			'```'
		)

		expect(act).toEqual(exp)
	})

	test('With props', () => {
		const node = {
			name: 'Props',
			prop: {
				const: {
					alpha: 'Alpha docs',
					bravo: 'Bravo docs',
				},
				let: {
					charlie: 'Charlie docs',
					delta: 'Delta docs',
					echo: 'Echo docs',
				},
			},
			default: {
				prop: {
					const: {
						bravo: 'null',
					},
					let: {
						delta: 'true',
						echo: '69',
					},
				},
			},
		}

		const act = htmlStringify(node)
		const exp = lines(
			'```svelte',
			'<Props', //
			'  bind:alpha',
			'  bind:bravo={null}',
			'  charlie',
			'  delta={true}',
			'  echo={69} />',
			'```'
		)

		expect(act).toEqual(exp)
	})

	test('With slots', () => {
		const node = {
			name: 'Slots',
			slot: {
				default: 'Meh',
				alpha: 'Alpha docs',
				bravo: 'Bravo docs',
			},
			default: {
				slot: {
					alpha: 'Alpha default',
					bravo: 'Bravo default',
				},
			},
		}

		const act = htmlStringify(node)
		const exp = lines(
			'```svelte',
			'<Slots>', //
			'  <tag />',
			'  <tag slot="alpha" />',
			'  <tag slot="bravo" />',
			'</Slots>',
			'```'
		)

		expect(act).toEqual(exp)
	})
})
