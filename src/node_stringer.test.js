import {
	stringifyInstancePropsAsHtml,
	stringifyInstancePropsAsJs,
} from './node_stringer'

const lines = (...lines) => lines.join('\n')

describe('renderer.js', () => {
	describe('stringifyInstancePropsAsHtml', () => {
		test('With no props', () => {
			const node = {
				name: 'Component',
			}

			const act = stringifyInstancePropsAsHtml(node)
			const exp = `<Component />`

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

			const act = stringifyInstancePropsAsHtml(node)
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

			const act = stringifyInstancePropsAsHtml(node)
			const exp = lines(
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

			const act = stringifyInstancePropsAsHtml(node)
			const exp = lines(
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

	describe('stringifyInstancePropsAsJs', () => {
		test('With no props', () => {
			const act = stringifyInstancePropsAsJs({})
			const exp = ``

			expect(act).toEqual(exp)
		})

		test('With undefined props', () => {
			const act = stringifyInstancePropsAsJs(undefined)
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

			const act = stringifyInstancePropsAsJs(props)
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
})
