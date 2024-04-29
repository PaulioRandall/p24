import stringifyJs from './stringify_js.js'

const lines = (...lines) => lines.join('\n')

describe('stringer_js.js', () => {
	describe('stringifyJs.props', () => {
		test('With no props', () => {
			const act = stringifyJs.props({})
			const exp = ``

			expect(act).toEqual(exp)
		})

		test('With undefined props', () => {
			const act = stringifyJs.props(undefined)
			const exp = ``

			expect(act).toEqual(exp)
		})

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
	})
})
