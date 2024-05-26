![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p24)](https://github.com/PaulioRandall/p24/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p24)](https://github.com/PaulioRandall/p24/releases)

# P24

Simple tool for documenting Svelte components via P23.

## Made to be Plundered

Do whatever as long as you adhere to the permissive MIT license found within.

## Functions

### `parse`

> TODO

### `renderReadme`

> TODO

## Back Story

I simply wanted to document a component's API within itself and regenerate that documentation in a form I please, particularly within a README. To clarify, I want to document the **interface** (API) to the component by documenting its single implementation. Ths includes details such as: name, description, module & instance properties, slots, set context, and defaults where applicable.

A few documentation tools come close but none completely satisfy my need for simplicity, readability, flexibility, ability to document all mentioned aspects of the API. Furthermore, existing tools traded-off too much flexibility for conciseness. So I set about creating **P24**. In the process I was able to separate the concern of parsing annotated comments into [**P23**](https://github.com/PaulioRandall/p23).

## Fore Story

There's plenty of room for improvement for a version 2. Here's a few ideas I've conjured:

**Remove some or all of the one letter aliases.** It was an attempt at conciseness that ruins readability when applied.

**Use the elegant `@` tag syntax from [JS Doc](https://jsdoc.app/) to specify defaults for props and slots:**

```js
//P24.prop.let.label:
// Text shown on the button.
// @default "Submit"
```

**Use the `@` tag syntax for specifying all parts of the documentation:**

```js
//P24:
// @prop
// @let
// @name label
// @default "Submit"
// Text shown on the button.
```

The above is too verbose but we can play with it. For example:

```js
//P24:
// @prop.let: label
// @default "Submit"
// Text shown on the button.
```

Or possible (requiring a breaking change to [**P23**](https://github.com/PaulioRandall/p23)):

```js
//P24:
// @prop.let.label = "Submit"
// Text shown on the button.
```

We are not constrained by historical standard character usage either. For example, this is also possible but not pleasant:

```js
//@:
// ^prop.let
// $label
// &"Submit"
// Text shown on the button.
```
