<script context="module">
	//P24.module.const.genres:
	// List of allowable genres.
	export const genres = [
		'Symphonic Power Metal',
		'Symphonic Black Metal',
		'Symphonic Death Metal',
	]

	//P24.module.let.formatDate:
	// Formats any dates, defaults to DD/MM/YYYY.
	export let formatDate = (date) => {
		return date.split('-').reverse().join('/')
	}
</script>

<script>
	import { setContext } from 'svelte'

	//P24.name: AlbumListItem
	//P24.description:
	// Details about an album. Designed to be used within a grid or flex grid.

	//P24.const.func: A random function to bind on that does nothing.
	//P24.default.const.func: {}
	export const func = () => {}

	//P24.let.title: Title of the album.
	export let title

	//P24.let.artist: Artist or band who created the album.
	export let artist

	//P24.let.published:
	// If known, the published date of the album in the format YYYY-MM-DD.
	//P24.default.let.published: null
	export let published = null

	//P24.context.album-title: See title prop.
	setContext('album-title', title)

	//P24.context.album-artist: See artist prop.
	setContext('album-title', artist)
</script>

<div class="album-list-item">
	<h2>{title}</h2>
	<p><b>Artist:</b>{artist}</p>
	{#if published}
		<p><b>Published:</b> {formatDate(published)}</p>
	{/if}
	<!--P24.slot.default: A description of the album. -->
	<!--P24.default.slot.default: "No description". -->
	<slot>
		No description.
	</slot>
</div>

<style>
	.album-list-item {
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
	}
</style>
