import mdStringify from './md_stringify.js'

const lines = (...lines) => lines.join('\n')

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
		}

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'```html',
			'<script context="module">',
			'\t// Alpha docs',
			'\texport const alpha',
			'',
			'\t// Bravo docs',
			'\texport const bravo',
			'',
			'\t// Charlie docs',
			'\texport let charlie',
			'',
			'\t// Delta docs',
			'\texport let delta',
			'',
			'\t// Echo docs',
			'\texport let echo',
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
		}

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'```html',
			'<script>',
			'\t// Alpha docs',
			'\texport const alpha',
			'',
			'\t// Bravo docs',
			'\texport const bravo',
			'',
			'\t// Charlie docs',
			'\texport let charlie',
			'',
			'\t// Delta docs',
			'\texport let delta',
			'',
			'\t// Echo docs',
			'\texport let echo',
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
		}

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'```html',
			'<!-- 123 -->',
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

	test('With context', () => {
		const node = {
			name: 'Component',
			context: {
				'a-b-c': 'Abc',
				'x-y-z': 'Xyz',
			},
		}

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'```html',
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
		}

		const act = mdStringify(node)
		const exp = lines(
			'### `<Component>`',
			'',
			'Message.',
			'',
			'```html',
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
