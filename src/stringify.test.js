import { markdown } from './stringify.js'

const newInput = () => {
	return {
		name: '',
		description: '',
		props: [
			/*
			{
				name: '',
				description: '',
				alias: [],
				const: false,
				module: false,
				default: '',
			}
		*/
		],
		slots: [
			/*
			{
				name: 'default',
				description: '',
			}
		*/
		],
		contexts: [
			/*
			{
				name: '',
				description: '',
			}
		*/
		],
		events: [
			/*
			{
				name: '',
				description: '',
			}
		*/
		],
	}
}

const lines = (...lines) => lines.join('\n')

describe('stringify.js', () => {
	describe('markdown', () => {
		test('name and description', () => {
			const input = newInput()
			input.name = 'Component'
			input.description = 'Message.'

			const act = markdown(input)

			const exp = lines('### `<Component>`', '', 'Message.')

			expect(act).toEqual(exp)
		})

		test('name without description', () => {
			const input = newInput()
			input.name = 'Component'

			const act = markdown(input)

			const exp = lines('### `<Component>`')

			expect(act).toEqual(exp)
		})

		test('let prop', () => {
			const input = newInput()
			input.name = 'Component'
			input.props = [
				{
					name: 'wizard',
					description: "A wizard's staff has a knob on the end.",
					alias: [],
					const: false,
					module: false,
					default: '',
				},
			]

			const act = markdown(input)

			const exp = lines(
				'### `<Component>`',
				'',
				'```svelte',
				'<script>',
				"\t// A wizard's staff has a knob on the end.",
				'\texport let wizard',
				'</script>',
				'```'
			)

			expect(act).toEqual(exp)
		})

		test('const prop', () => {
			const input = newInput()
			input.name = 'Component'
			input.props = [
				{
					name: 'wizard',
					description: "A wizard's staff has a knob on the end.",
					alias: [],
					const: true,
					module: false,
					default: '',
				},
			]

			const act = markdown(input)

			const exp = lines(
				'### `<Component>`',
				'',
				'```svelte',
				'<script>',
				"\t// A wizard's staff has a knob on the end.",
				'\texport const wizard',
				'</script>',
				'```'
			)

			expect(act).toEqual(exp)
		})

		test('module let prop', () => {
			const input = newInput()
			input.name = 'Component'
			input.props = [
				{
					name: 'wizard',
					description: "A wizard's staff has a knob on the end.",
					alias: [],
					const: false,
					module: true,
					default: '',
				},
			]

			const act = markdown(input)

			const exp = lines(
				'### `<Component>`',
				'',
				'```svelte',
				'<script context="module">',
				"\t// A wizard's staff has a knob on the end.",
				'\texport let wizard',
				'</script>',
				'```'
			)

			expect(act).toEqual(exp)
		})

		test('prop default', () => {
			const input = newInput()
			input.name = 'Component'
			input.props = [
				{
					name: 'wizard',
					description: "A wizard's staff has a knob on the end.",
					alias: [],
					const: false,
					module: false,
					default: '"value"',
				},
			]

			const act = markdown(input)

			const exp = lines(
				'### `<Component>`',
				'',
				'```svelte',
				'<script>',
				"\t// A wizard's staff has a knob on the end.",
				'\texport let wizard = "value"',
				'</script>',
				'```'
			)

			expect(act).toEqual(exp)
		})
	})
})
