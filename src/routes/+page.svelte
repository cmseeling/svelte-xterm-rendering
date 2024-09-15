<script>
	import PaneManager from '$lib/PaneManager/PaneManager.svelte';
	import { activeNode } from '$lib/state';
	import { addNode, createSingleNode } from '$lib/tree-utils';

	let tree = createSingleNode();

	const addSplit = () => {
		tree = addNode(tree, $activeNode, 'horizontal');
	};
</script>

<div class="h-screen">
	<PaneManager {tree} />
	<div>
		<button class="border-2 rounded-md bg-blue-300 px-2 hover:bg-blue-400" on:click={addSplit}
			>Split Screen</button
		>
	</div>
</div>
