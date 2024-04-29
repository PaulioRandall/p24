# P24

Simple tool for documenting Svelte components via P23.

## Components

### `<AlbumListItem>`

Details about an album. Designed to be used within a grid or flex grid.

```html
<script>
	// A random function to bind on that does nothing.
	export const func

	// Title of the album.
	export let title

	// Artist or band who created the album.
	export let artist

	// If known, the published date of the album in the format YYYY-MM-DD.
	export let published
</script>

<!-- A description of the album. -->
<slot />
```

### `<ModuleProps>`

> No documentation.

### `<Name and Description Component>`

Just a simple component with a name and description.

### `<Props>`

```html
<script>
	// 123
	export const abc

	// 789
	export let xyz
</script>
```

### `<Slots>`

```html
<!-- Meh -->
<slot />

<!-- 123 -->
<slot name="abc" />

<!-- 789 -->
<slot name="xyz" />
```
