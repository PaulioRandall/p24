![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p24)](https://github.com/PaulioRandall/p24/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p24)](https://github.com/PaulioRandall/p24/releases)

# P24

Simple tool for documenting Svelte components.

## Made to be Plundered

Fork, pillage, and plunder! Do whatever as long as you adhere to the project's permissive MIT license.

## Functions

### `parse(options = {})`

Given the component:

```html
<!--
  ArticlePreview.svelte

  This comment is not parsed by P24. If a comment
  doesn't start with '@' then it's just a normal
  comment.
  
  Name is inferred from the file name but may be
  specified as below.
-->

<!--@component ArticleListItem
  To be slotted into either an `ArticleList` or
  `ArticleGrid` component. It presents summary
  information about the article and a preview image.
  clicking the component will take the user to the
  full article.
-->

<script context="module">
  import { base } from '$app/paths'

  //@prop toFullPath
  // Resolves a relative URL path to a full URL path
  // by prepending the application base path.
  // @module
  // @const
  export const toFullPath = (relPath) => {
    return `${base}/${relPath}`
  }
</script>

<script>
  import { setContext } from 'svelte'

  //@prop title
  // Title of the article.
  export let title

  //@prop author
  // Name of the person or people who wrote the article.
  export let author

  //@prop link
  // URL to the full article.
  export let link

  //@prop published
  // Date the article was published or falsy value if
  // not yet published.
  // @default null 
  export let published = null

  //@prop image
  // URL of the preview image or falsy value to use
  // the stock image. You may used the named slot
  // 'image' if custom HTML is needed.
  // @default null
  export let image = null

  /*@ctx article-list-item
    All details about the article including whether
    slotted image and summary were provided.
  */
  setContext('article-list-item', {
    title,
    author,
    link,
    isPublished: !!published,
    published,
    image,
    hasImageSlot: $$slots.image,
    hasSummary: $$slots.default,
  })
</script>

<article>
  <h2>{title}</h2>

  {#if $$slots.image}
    <!--@slot image
      Alternative to using the 'image' property if
      custom HTML is needed to present the article
      preview thumbnail.
    -->
    <slot name="image" />
  {:else if image}
    <img src={image} />
  {:else}
    <img src="/images/stock-article-preview-image.jpg" />
  {/if}

  <!--@slot
    Short description of the article.
  -->
  <slot />
</article>
```

When parsed with:

```js
import p24 from 'p24'

const fileDocs = p24.parse()
```

Then `fileDocs` will be something similar to:

```js
[
  {
    name: "ArticlePreview.svelte",
    description: 
    relPath: "./src/lib/ArticlePreview.svelte",
    absPath: "/home/esmerelda/github/my-project/src/lib/ArticlePreview.svelte",
    nodes: {
      name: "ArticleListItem",
      descriptions: `To be slotted into either an \`ArticleList\` or \`ArticleGrid\` component. It
presents summary information about the article and a preview image.
clicking the component will take the user to the full article.`,
      module: {
        const: {
          toFullPath: `Resolves a relative URL path to a full URL path by prepending the
application root path.`
        }
      },
      props: {
        let: {
          title: "Title of the article.",
          author: "Name of the person or people who wrote the article.",
          link: "URL to the full article.",
          published: "Date the article was published or falsy value if not yet published."
          image: `URL of the preview image or falsy value to use the stock image.
You may used the named slot 'image' if custom HTML is needed.`
        }
      },
      context: {
        'article-list-item': `All details about the article including whether slotted image and summary
were provided.`
      },
      slots: {
        image: `Alternative to using the 'image' property if custom HTML is needed to
present the article preview image.`,
        default: "Short description of the article."
      },
    }
  }
]
```

**Options**

Defaults noted as field values. For information on glob and glob options see [NPM _glob_ package](https://www.npmjs.com/package/glob) ([Github](https://github.com/isaacs/node-glob)).

```js
import p24 from 'p24'

p24.parse({
  // Custom prefix for nodes.
  prefix: "@",

  // For SvelteKit packaged libraries you would use
  // "dist/*.svelte" or some variation of it.
  glob: "**/*.svelte",
  globOptions: {}
})
```

### `renderReadme(options = {})`

Parses the documentation then compiles a README from a template with the documentation.

By default, a template README file called `README.template.md` is read, placeholder text `{{PLACEHOLDER}}` is swapped out for the rendered documentation, before finally writing the whole thing to `README.md`.

Example output for a single component:

~~~markdown
### `<Form>`

Primary component in which fields are slotted into.
$restProps are passed to the form element (outer component element).

```svelte
<script context="module">
  // Store containing fields referenced by their input names.
  export let fields = writable({})

  // Store containing values referenced by their input names.
  export let values = writable({})

  // Store containing error messages referenced by their input names.
  // An empty string represents either no error or unvalidated.
  export let errors = writable({})

  // Store containing the passed form level properties.
  // 
  // $form = {
  //    id,
  //    validate,
  //    submit,
  // }
  export let form = writable({})
</script>
```

```svelte
<script>
  // Element id of the form.
  export let id = /* = Randomly assigned ID. */

  // Function for validating all fields. It accepts a field name to value
  // object and must return a field name to errors object.
  export let validate = null

  // Function for submitting the form. It accepts a field name to value
  // object.
  export let submit = null

  // See fields property.
  setContext("p17-fields", ...)

  // See values property.
  setContext("p17-values", ...)

  // See errors property.
  setContext("p17-errors", ...)

  // See form property.
  setContext("p17-form", ...)
</script>

<!-- Form fields, buttons, and anything else you fancy. -->
<slot />
```

```svelte
<Form
  id={/* = Randomly assigned ID. */}
  validate={null}
  submit={null}
>
  <div />
</Form>
```
~~~

**Options**

Defaults noted as field values. 

For information on glob and glob options see [NPM _glob_ package](https://www.npmjs.com/package/glob) ([Github](https://github.com/isaacs/node-glob)).

```js
import p24 from 'p24'

p24.parse({
  // Custom prefix for nodes.
  prefix: "@",

  // For SvelteKit packaged libraries you would use
  // "dist/*.svelte" or some variation of it.
  glob: "**/*.svelte",
  globOptions: {}

  // The name of the README template file.
  template: './README.template.md',

  // The output file name.
  output: './README.md',

  // The placeholder text in the template to swap
  // for the parsed and rendered documentation. 
  placeholder: '{{PLACEHOLDER}}',
})
```

**CLI**

This functionality is also available in CLI form allowing commands such as:

```bash
npx p24
```

And `package.json` scripts:

```json
{
  "scripts": {
    "docs": "p24"
  }
}
```

With most arguments available:

```bash
npx p24 \
  --prefix "@" \
  --glob "**/*.svelte" \
  --template "README.template.md" \
  --output "README.md" \
  --placeholder "{{PLACEHOLDER}}"
```

Or:

```bash
npx p24 \
  -p "@" \
  -g "**/*.svelte" \
  -t "README.template.md" \
  -o "README.md" \
  -s "{{PLACEHOLDER}}"
```

## Back Story

I simply wanted to document a component's API within itself and regenerate that documentation in a form I please, particularly within a README. To clarify, I want to document the **interface** (API) to the component by documenting its single implementation. Ths includes details such as its name, description, module and instance properties, slots, set context, and defaults where applicable.

A few documentation tools come close but none completely satisfy my need for simplicity, readability, flexibility, and ability to document all mentioned aspects of the API. Furthermore, existing tools traded-off too much flexibility for conciseness. So I set about creating **P24**. In the process I was able to separate the concern of parsing annotated comments into [**P23**](https://github.com/PaulioRandall/p23).
