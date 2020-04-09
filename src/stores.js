import {
    writable,
    readable
} from 'svelte/store';
import FlexSearch from 'flexsearch'
import NetWorkNode from './node'
import notyf from './notification'

export let db = FlexSearch.create()
export let nodes = new Map()

const {
    subscribe,
    set
} = writable([])

const ENDPOINT = '/path'

export const pathFinding = {
    nodesPath: {
        subscribe,
        set,
        reset() {
            set([])
        }
    },
    find(start, end) {
        return fetch(ENDPOINT, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    start,
                    end
                })
            })
            .then(res => res.json())
            .then(data => {
                const path = data.map(id => nodes.get(id));
                set(path)
                return data
            })
            .catch(err => {
                notyf.error('Impossible de trouver le degré de séparation entre les deux points.')
                console.error(err)
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
        const node = new NetWorkNode(data, db)
        nodes.set(node.id, node)
    }
    return nodes
}

export const currentNode = writable({});