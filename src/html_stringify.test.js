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
			'<Component>', //
			'```'
		)

		expect(act).toEqual(exp)
	})

	test('Name only', () => {
		const node = {
			name: 'Component',
			props: {
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
			defaults: {
				props: {
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
			'<Component', //
			'  bind:alpha',
			'  bind:bravo={null}',
			'  charlie',
			'  delta={true}',
			'  echo={69}>',
			'```'
		)

		expect(act).toEqual(exp)
	})
})
