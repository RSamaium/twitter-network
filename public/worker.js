importScripts('graph.js');

const graph = new Map()
const route = new Graph(graph)

onmessage = function (e) {
    const { type } = e.data
    if (type == 'initNode') {
        const { id } = e.data
        graph.set(id, new Map())
        return
    }
    if (type == 'addNode') {
        const { id, target } = e.data
        const map = graph.get(id)
        map.set(target, 1)

        const reverse = graph.get(target)
        reverse.set(id, 1)
        return
    }
    if (type == 'path') {
        const { start, end } = e.data
        const path = route.path(start, end)
        postMessage(path)
        return 
    }
}