import {
    writable,
    readable
} from 'svelte/store';
import FlexSearch from 'flexsearch'
import Graph from 'node-dijkstra'
import NetWorkNode from './node'

export let db = FlexSearch.create()
export let nodes = new Map()
export let route = new Graph()

export const dbInit = array => {
    for (let data of array) {
        const node = new NetWorkNode(data, db, route)
        nodes.set(node.id, node)
    }
    return nodes
}

export const currentNode = writable({});