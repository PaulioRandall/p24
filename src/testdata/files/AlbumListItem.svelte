<script context="module">
	//P24.module.const.genres:
	// List of allowable genres.
	export const genres = [
		'Symphonic Power Metal',
		'Symphonic Black Metal',
		'Symphonic Death Metal',
	]

	//P24.m.l.formatDate:
	// Formats any dates, defaults to DD/MM/YYYY.
	export let formatDate = (date) => {
		return date.split('-').reverse().join('/')
	}
</script>

<script>
	import { setContext } from 'svelte'
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	//P24.name: AlbumListItem
	//P24.desc:
	// Details about an album. Designed to be used within a grid or flex grid.

	//P24.prop.const.func: A random function to bind on that does nothing.
	//P24.default.prop.const.func: {}
	export const func = () => {}

	//P24.p.l.title: Title of the album.
	export let title

	//P24.p.let.artist: Artist or band who created the album.
	export let artist

	//P24.prop.l.published:
	// If known, the published date of the album in the format YYYY-MM-DD.
	//P24.d.p.l.published: null
	export let published = null

	//P24.context.album-title: See title prop.
	setContext('album-title', title)

	//P24.c.album-artist: See artist prop.
	setContext('album-title', artist)

	//p24.on.selected: Fired when this item is selected.
	const selected = () => {
		dispatch('selected', {
			title,
			artist,
			published,
		});
	}
</script>

<div class="album-list-item" on:click={selected}>
	<h2>{title}</h2>
	<p><b>Artist:</b>{artist}</p>
	{#if published}
		<p><b>Published:</b> {formatDate(published)}</p>
	{/if}
	<!--P24.slot.default: A description of the album. -->
	<!--P24.d.s.default: "No description". -->
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
