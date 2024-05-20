<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	//p24.on.custom: Eat my shorts.
	const dispatchCustomEvent = () => {
		dispatch('custom', {
			detailOne: 1,
			detailTwo: 2,
		});
	}

	//p24.event.another: Dental plan! Lisa needs braces!
	const dispatchAnotherEvent = () => {
		dispatch('another', {
			detailOne: 1,
			detailTwo: 2,
		});
	}
</script>
