import {
    writable,
    readable
} from 'svelte/store';
import FlexSearch from 'flexsearch'
import Graph from 'node-dijkstra'
import NetWorkNode from './node'

export let db = FlexSearch.create()
export let nodes = new Map()
export let route

const graph = new Map()

export let nodeSelected = writable({
    start: undefined,
    end: undefined,
    path: undefined
})
export let nodeToChange = writable('start')

export const dbInit = array => {
    for (let data of array) {
        const node = new NetWorkNode(data, db, graph)
        nodes.set(node.id, node)
    }
    route = new Graph(graph)
    return nodes
}

export const currentNode = writable({});