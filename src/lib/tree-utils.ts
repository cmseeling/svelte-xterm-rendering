import { derived, get, writable } from 'svelte/store';
import type { TreeNode, PaneData, Direction } from './types';
import { lastNodeId } from './state';
import { createSession } from './session-proxy';

export const findNode = (
	root: TreeNode<PaneData> | undefined | null,
	nodeId: number,
	suppliedParent: TreeNode<PaneData> | null = null
): [TreeNode<PaneData> | null, TreeNode<PaneData> | null] => {
	let returnValue: [TreeNode<PaneData> | null, TreeNode<PaneData> | null] = [null, null];
	if (root) {
		if (root.data.nodeId === nodeId) {
			returnValue = [suppliedParent, root];
		} else {
			for (let i = 0; i < root.childNodes.length; i++) {
				const [foundParent, foundNode] = findNode(root.childNodes[i], nodeId, root);
				if (foundNode !== null) {
					returnValue = [foundParent, foundNode];
					break;
				}
			}
		}
	}

	return returnValue;
};

export const createSingleNode = (parentNodeId?: number, existingSessionId?: number) => {
	const newId = get(lastNodeId) + 1;

	const height = writable(0);
	const width = writable(0);
	const area = derived([height, width], ([$height, $width]) => $height * $width);

	const newNode: TreeNode<PaneData> = {
		data: {
			nodeId: newId,
			parentNodeId,
			sessionId: existingSessionId,
			height,
			width,
			area
		},
		childNodes: []
	};

	if (existingSessionId === undefined) {
		const newSessionId = createSession();
		newNode.data.sessionId = newSessionId;
	}

	lastNodeId.set(newId);

	return newNode;
};

export const addNode = (
	tree: TreeNode<PaneData> | null,
	startNodeId: number,
	direction: Direction
): TreeNode<PaneData> => {
	if (tree === null) {
		const newNode = createSingleNode();
		return newNode;
	}

	const [parentNode, startNode] = findNode(tree, startNodeId);
	if (startNode === null) {
		return tree;
	} else {
		// PaneGroup is already going in the same direction so this new node can be added as a sibling
		if (parentNode && parentNode.data.direction === direction) {
			parentNode.childNodes.push(createSingleNode(parentNode.data.nodeId));
		} else {
			// pass session to child
			startNode.data.direction = direction;
			startNode.childNodes.push(createSingleNode(startNode.data.nodeId, startNode.data.sessionId));
			startNode.childNodes.push(createSingleNode(startNode.data.nodeId));
			startNode.data.sessionId = undefined;
		}
	}

	// console.log(tree);

	return tree;
};
