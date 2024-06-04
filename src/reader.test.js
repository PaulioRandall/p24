import { clean } from './reader.js'

describe('cleaner', () => {
	test('trims string with no newlines', () => {
		const act = clean('  abc  ')
		expect(act).toEqual('abc')
	})

	test('keeps indent on lines except first', () => {
		const act = clean('  abc\n    xyz')
		expect(act).toEqual('abc\n  xyz')
	})

	test('trims leading and trailing whitespace lines', () => {
		const act = clean('  \n  abc\n  xyz\n  ')
		expect(act).toEqual('abc\nxyz')
	})

	test('trims trailing whitespace', () => {
		const act = clean('abc  \nxyz  ')
		expect(act).toEqual('abc\nxyz')
	})

	test('given empty string then returns empty string', () => {
		const act = clean('')
		expect(act).toEqual('')
	})
})
