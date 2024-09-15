<script lang="ts">
	import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import '@xterm/xterm/css/xterm.css';
	import { Terminal } from '@xterm/xterm';
	import { FitAddon } from '@xterm/addon-fit';
	import { CanvasAddon } from '@xterm/addon-canvas';
	import { activeNode } from './state';
	import { readBuffer } from './session-proxy';

	export let nodeId: number | undefined = undefined;
	export let sessionId: number | undefined;
	export let height: Readable<number>;
	export let width: Readable<number>;
	export let area: Readable<number>;

	let loaded = false;
	let resizing = false;
	let frame: number;
	let fitAddon = new FitAddon();
	let terminal: Terminal;

	let update = () => {
		resizing = false;
		fitAddon.fit();
	};

	const requestUpdate = () => {
		if (!resizing) {
			if (update) {
				frame = requestAnimationFrame(update);
			}
		}
		resizing = true;
	};

	onMount(() => {
		console.log(`terminal screen mounting for sessionId ${sessionId}`);
		loaded = true;

		const areaUnsub = area.subscribe(($area) => {
			if ($area !== 0) {
				requestUpdate();
			}
		});

		return () => {
			console.log(`terminal screen unmounting for sessionId ${sessionId}`);
			cancelAnimationFrame(frame);
			areaUnsub();
		};
	});

	const xtermJs = (node: HTMLElement) => {
		terminal = new Terminal({
			fontFamily: 'Consolas, Monospace',
			theme: {
				background: '#020617'
			}
		});
		terminal.open(node);
		terminal.focus();
		if (nodeId) {
			$activeNode = nodeId;
		}

		// FitAddon Usage
		terminal.loadAddon(fitAddon);
		fitAddon.fit();
		terminal.loadAddon(new CanvasAddon());

		if (sessionId) {
			const sessionOutput = readBuffer(sessionId);
			terminal.write(sessionOutput);
		}

		terminal.element?.getElementsByTagName('textarea')[0].addEventListener('focus', () => {
			if (nodeId) {
				$activeNode = nodeId;
			}
		});
	};
</script>

{#if loaded}
	<div
		class="terminal-screen px-3"
		use:xtermJs
		style="--termHeight:{$height}px; --termWidth:{$width}px;"
	/>
{/if}

<style>
	.terminal-screen {
		height: var(--termHeight, 100%);
		width: var(--termWidth, 100%);
		overflow: hidden;
	}
</style>
