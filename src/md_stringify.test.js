import mdStringify from './md_stringify.js'

const lines = (...lines) => lines.join('\n')

describe('md_stringify.js', () => {
	test('With name & description', () => {
		const node = {
			name: 'Component',
			description: 'Message.',
		}

		const act = mdStringify(node)
		const exp = lines('### Component', '', 'Message.')

		expect(act).toEqual(exp)
	})

	test('With no props', () => {
		const node = {
			name: 'Component',
			props: {},
		}

		const act = mdStringify(node)
		const exp = lines('### Component', '', '> No documentation.')

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
			'### Component',
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
			'### Component',
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

	test('With everything', () => {
		const node = {
			name: 'Component',
			description: 'Message.',
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
			slots: {
				default: '123',
				abc: '456',
				xyz: '789',
			},
		}

		const act = mdStringify(node)
		const exp = lines(
			'### Component',
			'',
			'Message.',
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
			'',
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

	/*


		test('With const & let props', () => {
			const props = {
				const: {
					alpha: 'Alpha docs',
					bravo: 'Bravo docs',
				},
				let: {
					charlie: 'Charlie docs',
					delta: 'Delta docs',
					echo: 'Echo docs',
				},
			}

			const act = stringifyJs.props(props)
			const exp = lines(
				'// Alpha docs',
				'export const alpha',
				'',
				'// Bravo docs',
				'export const bravo',
				'',
				'// Charlie docs',
				'export let charlie',
				'',
				'// Delta docs',
				'export let delta',
				'',
				'// Echo docs',
				'export let echo'
			)

			expect(act).toEqual(exp)
		})
	})

	describe('stringifyJs.slots', () => {
		test('With no slots', () => {
			const act = stringifyJs.slots({})
			const exp = ``

			expect(act).toEqual(exp)
		})

		test('With undefined slots', () => {
			const act = stringifyJs.slots(undefined)
			const exp = ``

			expect(act).toEqual(exp)
		})

		test('With default slot', () => {
			const slots = {
				default: 'Message',
			}

			const act = stringifyJs.slots(slots)
			const exp = lines('// Message', '<slot />')

			expect(act).toEqual(exp)
		})

		test('With named slots', () => {
			const slots = {
				abc: '123',
				xyz: '789'
			}

			const act = stringifyJs.slots(slots)
			const exp = lines(
				'// 123',
				'<slot name="abc" />',
				'',
				'// 789',
				'<slot name="xyz" />',
			)

			expect(act).toEqual(exp)
		})
	})
	*/
})
