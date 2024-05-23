export default class {
	constructor() {
		this.lines = []
		this.chars = ''
	}

	append(s) {
		this.chars += s
	}

	line(s = '') {
		this.lines.push(this.chars + s)
		this.chars = ''
	}

	toString() {
		this.line()
		return this.lines.join('\n').trim()
	}
}
