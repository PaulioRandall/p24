import { stringifyNodeInstance } from './node_stringer'

const lines = (...lines) => lines.join('\n')

describe('renderer.js', () => {
	describe('stringifyNodeInstance', () => {
		test('With no props', () => {
			const node = {
				name: 'Abc',
			}

			const act = stringifyNodeInstance(node)
			const exp = `<Abc />`

			expect(act).toEqual(exp)
		})

		test('With const props', () => {
			const node = {
				name: 'Component',
				props: {
					const: {
						alpha: 'string',
						bravo: true,
						charlie: 123,
						delta: null,
						echo: undefined,
					},
				},
			}

			const act = stringifyNodeInstance(node)
			const exp = lines(
				//
				'<Component',
				'\t<!-- const -->',
				'\tbind:alpha="string"',
				'\tbind:bravo={true}',
				'\tbind:charlie={123}',
				'\tbind:delta={null}',
				'\tbind:echo={undefined} />'
			)

			expect(act).toEqual(exp)
		})

		test('With let props', () => {
			const node = {
				name: 'Component',
				props: {
					let: {
						alpha: 'string',
						bravo: true,
						charlie: 123,
						delta: null,
						echo: undefined,
					},
				},
			}

			const act = stringifyNodeInstance(node)
			const exp = lines(
				//
				'<Component',
				'\t<!-- let -->',
				'\talpha="string"',
				'\tbravo={true}',
				'\tcharlie={123}',
				'\tdelta={null}',
				'\techo={undefined} />'
			)

			expect(act).toEqual(exp)
		})

		test('With const & let props', () => {
			const node = {
				name: 'Component',
				props: {
					const: {
						alpha: 'string',
						bravo: true,
					},
					let: {
						charlie: 123,
						delta: null,
					},
				},
			}

			const act = stringifyNodeInstance(node)
			const exp = lines(
				//
				'<Component',
				'\t<!-- const -->',
				'\tbind:alpha="string"',
				'\tbind:bravo={true}',
				'\t<!-- let -->',
				'\tcharlie={123}',
				'\tdelta={null} />'
			)

			expect(act).toEqual(exp)
		})
	})
})
