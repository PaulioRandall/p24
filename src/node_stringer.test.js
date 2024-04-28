import {
	stringifyNodeAsHtml,
	stringifyNodeInstancePropsAsJs,
} from './node_stringer'

const lines = (...lines) => lines.join('\n')

describe('renderer.js', () => {
	describe('stringifyNodeAsHtml', () => {
		test('With no props', () => {
			const node = {
				name: 'Component',
			}

			const act = stringifyNodeAsHtml(node)
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

			const act = stringifyNodeAsHtml(node)
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

			const act = stringifyNodeAsHtml(node)
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

			const act = stringifyNodeAsHtml(node)
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

	describe('stringifyNodeInstancePropsAsJs', () => {
		test('With no props', () => {
			const act = stringifyNodeInstancePropsAsJs({})
			const exp = ``

			expect(act).toEqual(exp)
		})

		test('With undefined props', () => {
			const act = stringifyNodeInstancePropsAsJs(undefined)
			const exp = ``

			expect(act).toEqual(exp)
		})

		test('With const & let props', () => {
			const props = {
				const: {
					alpha: 'string',
					bravo: true,
				},
				let: {
					charlie: 123,
					delta: null,
					echo: undefined,
				},
			}

			const act = stringifyNodeInstancePropsAsJs(props)
			const exp = lines(
				'export const alpha = "string"',
				'export const bravo = true',
				'',
				'export let charlie = 123',
				'export let delta = null',
				'export let echo = undefined'
			)

			expect(act).toEqual(exp)
		})
	})
})
