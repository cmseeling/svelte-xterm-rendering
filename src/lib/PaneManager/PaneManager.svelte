<script lang="ts">
	import { PaneGroup, Pane } from 'paneforge';
	import type { Direction, TreeNode, PaneData } from '$lib/types';
	import Divider from './Divider.svelte';
	import TerminalScreen from '$lib/TerminalScreen.svelte';

	export let tree: TreeNode<PaneData>;

	const forceDirectionType = (direction?: Direction): Direction => {
		if (direction) {
			return direction as Direction;
		} else {
			return 'horizontal';
		}
	};

	const getDefaultSize = () => {
		const fraction = 1 / tree.childNodes.length;
		return fraction * 100;
	};

	$: height = tree.data.height;
	$: width = tree.data.width;
</script>

{#if tree.childNodes.length === 0}
	<div
		data-testid="terminal-container"
		class="h-5/6"
		bind:clientHeight={$height}
		bind:clientWidth={$width}
	>
		<TerminalScreen
			nodeId={tree.data.nodeId}
			sessionId={tree.data.sessionId}
			height={tree.data.height}
			width={tree.data.width}
			area={tree.data.area}
		/>
	</div>
{:else}
	<PaneGroup
		direction={forceDirectionType(tree.data.direction)}
		class="h-5/6"
		data-testid="pane-group"
	>
		{#each tree.childNodes as node, i (node.data.nodeId)}
			<Pane defaultSize={getDefaultSize()} data-testid={`pane-${node.data.nodeId}`}>
				<svelte:self tree={node} />
			</Pane>
			{#if i < tree.childNodes.length - 1}
				<Divider direction={forceDirectionType(tree.data.direction)} />
			{/if}
		{/each}
	</PaneGroup>
{/if}
