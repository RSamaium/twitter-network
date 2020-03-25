import {
    writable,
    readable
} from 'svelte/store';
import FlexSearch from 'flexsearch'

export let db = null
export let dataById = new Map()

export const dbInit = data => {
    db = FlexSearch.create()
    for (let node of data.n) {
        db.add(node.i, node.l)
        dataById.set(node.i, node)
    }
}

export const currentNode = writable({});