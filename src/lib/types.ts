import type { Readable } from 'svelte/motion';
import type { Writable } from 'svelte/store';

export type Direction = 'horizontal' | 'vertical';

export interface TreeNode<T> {
	data: T;
	childNodes: TreeNode<T>[];
}

export interface PaneData {
	nodeId: number;
	sessionId?: number;
	parentNodeId?: number;
	direction?: Direction;
	height: Writable<number>;
	width: Writable<number>;
	area: Readable<number>;
}
