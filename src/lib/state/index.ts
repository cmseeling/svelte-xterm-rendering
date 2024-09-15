import { writable } from 'svelte/store';

export const lastNodeId = writable(0);
export const activeNode = writable(0);
