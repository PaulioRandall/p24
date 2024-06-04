export default class {
	constructor() {
		this.lines = []
		this.chars = ''
	}

	append(s) {
		this.chars += s
		return this
	}

	line(s = '') {
		this.lines.push(this.chars + s)
		this.chars = ''
		return this
	}

	toString() {
		this.line()
		return this.lines.join('\n').trim()
	}
}
