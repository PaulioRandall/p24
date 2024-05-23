import mdStringify from './md_stringify.js'

const lines = (...lines) => lines.join('\n')

const EMPTY_DEFAULTS = {
	module: {
		const: {},
		let: {},
	},
	props: {
		const: {},
		let: {},
	},
	slots: {},
}

describe('md_stringify.js', () => {
	test('With name & description', () => {
		const node = {
			name: 'Component',
			description: 'Message.',
		}

		const act = mdStringify(node)
		const exp = lines('### `<Component>`', '', 'Message.')

		expect(act).toEqual(exp)
	})

	test('With no props', () => {
		const node = {
			name: 'Component',
			props: {},
			defaults: EMPTY_DEFAULTS,
		}

		const act = mdStringify(node)
		const exp = lines('### `<Component>`', '', '> No documentation.')

		expect(act).toEqual(exp)
	})

	test('With const & let module props', () => {
		const node = {
			name: 'Component',
			module: {
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
				module: {
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

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'```svelte',
			'<script context="module">',
			'\t// Alpha docs',
			'\texport const alpha',
			'',
			'\t// Bravo docs',
			'\texport const bravo = null',
			'',
			'\t// Charlie docs',
			'\texport let charlie',
			'',
			'\t// Delta docs',
			'\texport let delta = true',
			'',
			'\t// Echo docs',
			'\texport let echo = 69',
			'</script>',
			'```'
		)

		expect(act).toEqual(exp)
	})

	test('With const & let props', () => {
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
				module: {
					const: {},
					let: {},
				},
				props: {
					const: {
						bravo: '"abc"',
					},
					let: {
						delta: 'true',
						echo: '69',
					},
				},
				slots: {},
			},
		}

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'```svelte',
			'<script>',
			'\t// Alpha docs',
			'\texport const alpha',
			'',
			'\t// Bravo docs',
			'\texport const bravo = "abc"',
			'',
			'\t// Charlie docs',
			'\texport let charlie',
			'',
			'\t// Delta docs',
			'\texport let delta = true',
			'',
			'\t// Echo docs',
			'\texport let echo = 69',
			'</script>',
			'```'
		)

		expect(act).toEqual(exp)
	})

	test('With props that have indented lines', () => {
		const node = {
			name: 'Component',
			props: {
				const: {
					alpha: '{\n\ta\n\tb\n\tc\n}',
				},
			},
			defaults: EMPTY_DEFAULTS,
		}

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'```svelte',
			'<script>',
			'\t// {',
			'\t// 	a',
			'\t// 	b',
			'\t// 	c',
			'\t// }',
			'\texport const alpha',
			'</script>',
			'```'
		)

		expect(act).toEqual(exp)
	})

	test('With slots', () => {
		const node = {
			name: 'Component',
			slots: {
				default: '123',
				abc: '456',
				xyz: '789',
			},
			defaults: {
				module: {
					const: {},
					let: {},
				},
				props: {
					const: {},
					let: {},
				},
				slots: {
					abc: 'ABC',
					xyz: 'XYZ',
				},
			},
		}

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'```svelte',
			'<!-- 123 -->',
			'<slot />',
			'',
			'<!-- 456 -->',
			'<!-- Default: ABC -->',
			'<slot name="abc" />',
			'',
			'<!-- 789 -->',
			'<!-- Default: XYZ -->',
			'<slot name="xyz" />',
			'```'
		)

		expect(act).toEqual(exp)
	})

	test('With context', () => {
		const node = {
			name: 'Component',
			context: {
				'a-b-c': 'Abc',
				'x-y-z': 'Xyz',
			},
			defaults: EMPTY_DEFAULTS,
		}

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'```svelte',
			'<script>',
			'\t// Abc',
			"\tsetContext('a-b-c', ...)",
			'',
			'\t// Xyz',
			"\tsetContext('x-y-z', ...)",
			'</script>',
			'```'
		)

		expect(act).toEqual(exp)
	})

	test('With everything', () => {
		const node = {
			name: 'Component',
			description: 'Message.',
			module: {
				const: {
					alpha: 'Alpha docs\nAnother line',
					bravo: 'Bravo docs',
				},
				let: {
					charlie: 'Charlie docs\nAnother line',
					delta: 'Delta docs',
					echo: 'Echo docs',
				},
			},
			props: {
				const: {
					alpha: 'Alpha docs\nAnother line',
					bravo: 'Bravo docs',
				},
				let: {
					charlie: 'Charlie docs\nAnother line',
					delta: 'Delta docs',
					echo: 'Echo docs',
				},
			},
			slots: {
				default: '123\nAnother line',
				abc: '456',
				xyz: '789',
			},
			context: {
				'a-b-c': 'abc ctx',
				'x-y-z': 'xyz ctx',
			},
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

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'Message.',
			'',
			'```svelte',
			'<script context="module">',
			'\t// Alpha docs',
			'\t// Another line',
			'\texport const alpha',
			'',
			'\t// Bravo docs',
			'\texport const bravo',
			'',
			'\t// Charlie docs',
			'\t// Another line',
			'\texport let charlie',
			'',
			'\t// Delta docs',
			'\texport let delta',
			'',
			'\t// Echo docs',
			'\texport let echo',
			'</script>',
			'',
			'<script>',
			'\t// Alpha docs',
			'\t// Another line',
			'\texport const alpha',
			'',
			'\t// Bravo docs',
			'\texport const bravo',
			'',
			'\t// Charlie docs',
			'\t// Another line',
			'\texport let charlie',
			'',
			'\t// Delta docs',
			'\texport let delta',
			'',
			'\t// Echo docs',
			'\texport let echo',
			'',
			'\t// abc ctx',
			"\tsetContext('a-b-c', ...)",
			'',
			'\t// xyz ctx',
			"\tsetContext('x-y-z', ...)",
			'</script>',
			'',
			'<!--',
			'	123',
			'	Another line',
			'-->',
			'<slot />',
			'',
			'<!-- 456 -->',
			'<slot name="abc" />',
			'',
			'<!-- 789 -->',
			'<slot name="xyz" />',
			'```'
		)

		expect(act).toEqual(exp)
	})
})
