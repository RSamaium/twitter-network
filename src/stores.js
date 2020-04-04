import {
    writable,
    readable
} from 'svelte/store';
import FlexSearch from 'flexsearch'
import NetWorkNode from './node'

export let db = FlexSearch.create()
export let nodes = new Map()

const worker = new Worker('worker.js')

worker.onerror = function(err) {
    console.log(err)
}

export const pathFinding = {
    nodesPath: readable([], function start (set) {
        worker.onmessage = (e) => {
            const path = e.data.map(id => nodes.get(id));
            path.pop();
            path.shift();
            set(path)
        }
    }),
    find(start, end) {
        worker.postMessage({
            type: 'path',
            start,
            end
        })
    }
}

export let nodeSelected = writable({
    start: undefined,
    end: undefined,
    path: undefined
})
export let nodeToChange = writable('start')

export const dbInit = array => {
    for (let data of array) {
        const node = new NetWorkNode(data, db, worker)
        nodes.set(node.id, node)
    }
    return nodes
}

export const currentNode = writable({});