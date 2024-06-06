import { markdown, html } from './stringify.js'

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
		describe('name and description', () => {
			test('name only', () => {
				const input = newInput()
				input.name = 'Component'

				const act = markdown(input)

				const exp = lines('### `<Component>`')

				expect(act).toEqual(exp)
			})

			test('name and description', () => {
				const input = newInput()
				input.name = 'Component'
				input.description = 'Message.'

				const act = markdown(input)

				const exp = lines('### `<Component>`', '', 'Message.')

				expect(act).toEqual(exp)
			})
		})

		describe('props', () => {
			test('let', () => {
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

			test('const', () => {
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

			test('module let', () => {
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

			test('default', () => {
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

			test('multiple', () => {
				const input = newInput()
				input.name = 'Component'
				input.props = [
					{
						name: 'wizard_a',
						description: "A wizard's staff has a knob on the end.",
						alias: [],
						const: false,
						module: false,
						default: '',
					},
					{
						name: 'wizard_b',
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
					'\texport let wizard_a',
					'',
					"\t// A wizard's staff has a knob on the end.",
					'\texport let wizard_b',
					'</script>',
					'```'
				)

				expect(act).toEqual(exp)
			})

			test('module and instance', () => {
				const input = newInput()
				input.name = 'Component'
				input.props = [
					{
						name: 'wizard_a',
						description: "A wizard's staff has a knob on the end.",
						alias: [],
						const: false,
						module: true,
						default: '',
					},
					{
						name: 'wizard_b',
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
					'<script context="module">',
					"\t// A wizard's staff has a knob on the end.",
					'\texport let wizard_a',
					'</script>',
					'```',
					'',
					'```svelte',
					'<script>',
					"\t// A wizard's staff has a knob on the end.",
					'\texport let wizard_b',
					'</script>',
					'```'
				)

				expect(act).toEqual(exp)
			})
		})

		describe('contexts', () => {
			test('single', () => {
				const input = newInput()
				input.name = 'Component'
				input.contexts = [
					{
						name: 'wizard',
						description: "A wizard's staff has a knob on the end.",
					},
				]

				const act = markdown(input)

				const exp = lines(
					'### `<Component>`',
					'',
					'```svelte',
					'<script>',
					"\t// A wizard's staff has a knob on the end.",
					'\tsetContext("wizard", ...)',
					'</script>',
					'```'
				)

				expect(act).toEqual(exp)
			})

			test('multiple', () => {
				const input = newInput()
				input.name = 'Component'
				input.contexts = [
					{
						name: 'wizard_a',
						description: "A wizard's staff has a knob on the end.",
					},
					{
						name: 'wizard_b',
						description: "A wizard's staff has a knob on the end.",
					},
				]

				const act = markdown(input)

				const exp = lines(
					'### `<Component>`',
					'',
					'```svelte',
					'<script>',
					"\t// A wizard's staff has a knob on the end.",
					'\tsetContext("wizard_a", ...)',
					'',
					"\t// A wizard's staff has a knob on the end.",
					'\tsetContext("wizard_b", ...)',
					'</script>',
					'```'
				)

				expect(act).toEqual(exp)
			})
		})

		describe('slots', () => {
			test('default', () => {
				const input = newInput()
				input.name = 'Component'
				input.slots = [
					{
						name: 'default',
						description: "A wizard's staff has a knob on the end.",
					},
				]

				const act = markdown(input)

				const exp = lines(
					'### `<Component>`',
					'',
					'```svelte',
					"<!-- A wizard's staff has a knob on the end. -->",
					'<slot />',
					'```'
				)

				expect(act).toEqual(exp)
			})

			test('named', () => {
				const input = newInput()
				input.name = 'Component'
				input.slots = [
					{
						name: 'wizard',
						description: "A wizard's staff has a knob on the end.",
					},
				]

				const act = markdown(input)

				const exp = lines(
					'### `<Component>`',
					'',
					'```svelte',
					"<!-- A wizard's staff has a knob on the end. -->",
					'<slot name="wizard" />',
					'```'
				)

				expect(act).toEqual(exp)
			})

			test('multiple', () => {
				const input = newInput()
				input.name = 'Component'
				input.slots = [
					{
						name: 'wizard_a',
						description: "A wizard's staff has a knob on the end.",
					},
					{
						name: 'wizard_b',
						description: "A wizard's staff has a knob on the end.",
					},
				]

				const act = markdown(input)

				const exp = lines(
					'### `<Component>`',
					'',
					'```svelte',
					"<!-- A wizard's staff has a knob on the end. -->",
					'<slot name="wizard_a" />',
					'',
					"<!-- A wizard's staff has a knob on the end. -->",
					'<slot name="wizard_b" />',
					'```'
				)

				expect(act).toEqual(exp)
			})
		})

		describe('events', () => {
			test('single', () => {
				const input = newInput()
				input.name = 'Component'
				input.events = [
					{
						name: 'wizard',
						description: "A wizard's staff has a knob on the end.",
					},
				]

				const act = markdown(input)

				const exp = lines(
					'### `<Component>`',
					'',
					'```svelte',
					'<script>',
					"\t// A wizard's staff has a knob on the end.",
					'\tdispatch("wizard", {})',
					'</script>',
					'```'
				)

				expect(act).toEqual(exp)
			})
		})

		describe('everything', () => {
			test('single', () => {
				const input = newInput()
				input.name = 'Component'
				input.description = "A wizard's staff has a knob on the end."
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
				input.contexts = [
					{
						name: 'wizard',
						description: "A wizard's staff has a knob on the end.",
					},
				]
				input.events = [
					{
						name: 'wizard',
						description: "A wizard's staff has a knob on the end.",
					},
				]
				input.slots = [
					{
						name: 'wizard',
						description: "A wizard's staff has a knob on the end.",
					},
				]

				const act = markdown(input)

				const exp = lines(
					'### `<Component>`',
					'',
					"A wizard's staff has a knob on the end.",
					'',
					'```svelte',
					'<script>',
					"\t// A wizard's staff has a knob on the end.",
					'\texport let wizard',
					'',
					"\t// A wizard's staff has a knob on the end.",
					'\tsetContext("wizard", ...)',
					'',
					"\t// A wizard's staff has a knob on the end.",
					'\tdispatch("wizard", {})',
					'</script>',
					'',
					"<!-- A wizard's staff has a knob on the end. -->",
					'<slot name="wizard" />',
					'```'
				)

				expect(act).toEqual(exp)
			})
		})
	})

	describe('html', () => {
		test('name', () => {
			const input = newInput()
			input.name = 'Component'

			const act = html(input)

			const exp = lines(
				'```svelte',
				'<Component />', //
				'```'
			)

			expect(act).toEqual(exp)
		})

		test('props', () => {
			const input = newInput()
			input.name = 'Component'
			input.props = [
				{
					name: 'wizard',
					description: '',
					alias: [],
					const: false,
					module: false,
					default: '',
				},
				{
					name: 'witch',
					description: '',
					alias: [],
					const: false,
					module: false,
					default: '"hag"',
				},
				{
					name: 'warlord',
					description: '',
					alias: [],
					const: false,
					module: false,
					default: '69',
				},
				{
					name: 'warlock',
					description: '',
					alias: [],
					const: true,
					module: false,
				},
			]

			const act = html(input)

			const exp = lines(
				'```svelte',
				'<Component',
				'\twizard',
				'\twitch="hag"',
				'\twarlord={69}',
				'\tbind:warlock',
				'/>',
				'```'
			)

			expect(act).toEqual(exp)
		})

		test('slots', () => {
			const input = newInput()
			input.name = 'Component'
			input.slots = [
				{
					name: 'default',
					description: '',
				},
				{
					name: 'wizard',
					description: '',
				},
				{
					name: 'witch',
					description: '',
				},
			]

			const act = html(input)

			const exp = lines(
				'```svelte',
				'<Component>',
				'\t<div />',
				'\t<div slot="wizard" />',
				'\t<div slot="witch" />',
				'</Component>',
				'```'
			)

			expect(act).toEqual(exp)
		})
	})
})
