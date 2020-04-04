/**
 * This very basic implementation of a priority queue is used to select the
 * next node of the graph to walk to.
 *
 * The queue is always sorted to have the least expensive node on top.
 * Some helper methods are also implemented.
 *
 * You should **never** modify the queue directly, but only using the methods
 * provided by the class.
 */
class Queue {

    /**
     * Creates a new empty priority queue
     */
    constructor() {
        // The `keys` set is used to greatly improve the speed at which we can
        // check the presence of a value in the queue
        this.keys = new Set();
        this.queue = [];
    }

    /**
     * Sort the queue to have the least expensive node to visit on top
     *
     * @private
     */
    sort() {
        this.queue.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Sets a priority for a key in the queue.
     * Inserts it in the queue if it does not already exists.
     *
     * @param {any}     key       Key to update or insert
     * @param {number}  value     Priority of the key
     * @return {number} Size of the queue
     */
    set(key, value) {
        const priority = Number(value);
        if (isNaN(priority)) throw new TypeError('"priority" must be a number');

        if (!this.keys.has(key)) {
            // Insert a new entry if the key is not already in the queue
            this.keys.add(key);
            this.queue.push({
                key,
                priority
            });
        } else {
            // Update the priority of an existing key
            this.queue.map((element) => {
                if (element.key === key) {
                    Object.assign(element, {
                        priority
                    });
                }

                return element;
            });
        }

        this.sort();
        return this.queue.length;
    }

    /**
     * The next method is used to dequeue a key:
     * It removes the first element from the queue and returns it
     *
     * @return {object} First priority queue entry
     */
    next() {
        const element = this.queue.shift();

        // Remove the key from the `_keys` set
        this.keys.delete(element.key);

        return element;
    }

    /**
     * @return {boolean} `true` when the queue is empty
     */
    isEmpty() {
        return Boolean(this.queue.length === 0);
    }

    /**
     * Check if the queue has a key in it
     *
     * @param {any} key   Key to lookup
     * @return {boolean}
     */
    has(key) {
        return this.keys.has(key);
    }

    /**
     * Get the element in the queue with the specified key
     *
     * @param {any} key   Key to lookup
     * @return {object}
     */
    get(key) {
        return this.queue.find(element => element.key === key);
    }

}


/**
 * Removes a key and all of its references from a map.
 * This function has no side-effects as it returns
 * a brand new map.
 *
 * @param {Map}     map - Map to remove the key from
 * @param {string}  key - Key to remove from the map
 * @return {Map}    New map without the passed key
 */
function removeDeepFromMap(map, key) {
    const newMap = new Map();

    for (const [aKey, val] of map) {
        if (aKey !== key && val instanceof Map) {
            newMap.set(aKey, removeDeepFromMap(val, key));
        } else if (aKey !== key) {
            newMap.set(aKey, val);
        }
    }

    return newMap;
}


/**
 * Validates a cost for a node
 *
 * @private
 * @param {number} val - Cost to validate
 * @return {bool}
 */
function isValidNode(val) {
    const cost = Number(val);

    if (isNaN(cost) || cost <= 0) {
        return false;
    }

    return true;
}

/**
 * Creates a deep `Map` from the passed object.
 *
 * @param  {Object} source - Object to populate the map with
 * @return {Map} New map with the passed object data
 */
function toDeepMap(source) {
    const map = new Map();
    const keys = Object.keys(source);

    keys.forEach((key) => {
        const val = source[key];

        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
            return map.set(key, toDeepMap(val));
        }

        if (!isValidNode(val)) {
            throw new Error(`Could not add node at key "${key}", make sure it's a valid node`, val);
        }

        return map.set(key, Number(val));
    });

    return map;
}

/**
 * Validate a map to ensure all it's values are either a number or a map
 *
 * @param {Map} map - Map to valiadte
 */
function validateDeep(map) {
    if (!(map instanceof Map)) {
        throw new Error(`Invalid graph: Expected Map instead found ${typeof map}`);
    }

    map.forEach((value, key) => {
        if (typeof value === 'object' && value instanceof Map) {
            validateDeep(value);
            return;
        }

        if (typeof value !== 'number' || value <= 0) {
            throw new Error(`Values must be numbers greater than 0. Found value ${value} at ${key}`);
        }
    });
}

/** Creates and manages a graph */
class Graph {

    /**
     * Creates a new Graph, optionally initializing it a nodes graph representation.
     *
     * A graph representation is an object that has as keys the name of the point and as values
     * the points reacheable from that node, with the cost to get there:
     *
     *     {
     *       node (Number|String): {
     *         neighbor (Number|String): cost (Number),
     *         ...,
     *       },
     *     }
     *
     * In alternative to an object, you can pass a `Map` of `Map`. This will
     * allow you to specify numbers as keys.
     *
     * @param {Objec|Map} [graph] - Initial graph definition
     * @example
     *
     * const route = new Graph();
     *
     * // Pre-populated graph
     * const route = new Graph({
     *   A: { B: 1 },
     *   B: { A: 1, C: 2, D: 4 },
     * });
     *
     * // Passing a Map
     * const g = new Map()
     *
     * const a = new Map()
     * a.set('B', 1)
     *
     * const b = new Map()
     * b.set('A', 1)
     * b.set('C', 2)
     * b.set('D', 4)
     *
     * g.set('A', a)
     * g.set('B', b)
     *
     * const route = new Graph(g)
     */
    constructor(graph) {
        if (graph instanceof Map) {
            validateDeep(graph);
            this.graph = graph;
        } else if (graph) {
            this.graph = toDeepMap(graph);
        } else {
            this.graph = new Map();
        }
    }

    /**
     * Adds a node to the graph
     *
     * @param {string} name      - Name of the node
     * @param {Object|Map} neighbors - Neighbouring nodes and cost to reach them
     * @return {this}
     * @example
     *
     * const route = new Graph();
     *
     * route.addNode('A', { B: 1 });
     *
     * // It's possible to chain the calls
     * route
     *   .addNode('B', { A: 1 })
     *   .addNode('C', { A: 3 });
     *
     * // The neighbors can be expressed in a Map
     * const d = new Map()
     * d.set('A', 2)
     * d.set('B', 8)
     *
     * route.addNode('D', d)
     */
    addNode(name, neighbors) {
        let nodes;
        if (neighbors instanceof Map) {
            validateDeep(neighbors);
            nodes = neighbors;
        } else {
            nodes = toDeepMap(neighbors);
        }

        this.graph.set(name, nodes);

        return this;
    }

    /**
     * @deprecated since version 2.0, use `Graph#addNode` instead
     */
    addVertex(name, neighbors) {
        return this.addNode(name, neighbors);
    }

    /**
     * Removes a node and all of its references from the graph
     *
     * @param {string|number} key - Key of the node to remove from the graph
     * @return {this}
     * @example
     *
     * const route = new Graph({
     *   A: { B: 1, C: 5 },
     *   B: { A: 3 },
     *   C: { B: 2, A: 2 },
     * });
     *
     * route.removeNode('C');
     * // The graph now is:
     * // { A: { B: 1 }, B: { A: 3 } }
     */
    removeNode(key) {
        this.graph = removeDeepFromMap(this.graph, key);

        return this;
    }

    /**
     * Compute the shortest path between the specified nodes
     *
     * @param {string}  start     - Starting node
     * @param {string}  goal      - Node we want to reach
     * @param {object}  [options] - Options
     *
     * @param {boolean} [options.trim]    - Exclude the origin and destination nodes from the result
     * @param {boolean} [options.reverse] - Return the path in reversed order
     * @param {boolean} [options.cost]    - Also return the cost of the path when set to true
     *
     * @return {array|object} Computed path between the nodes.
     *
     *  When `option.cost` is set to true, the returned value will be an object with shape:
     *    - `path` *(Array)*: Computed path between the nodes
     *    - `cost` *(Number)*: Cost of the path
     *
     * @example
     *
     * const route = new Graph()
     *
     * route.addNode('A', { B: 1 })
     * route.addNode('B', { A: 1, C: 2, D: 4 })
     * route.addNode('C', { B: 2, D: 1 })
     * route.addNode('D', { C: 1, B: 4 })
     *
     * route.path('A', 'D') // => ['A', 'B', 'C', 'D']
     *
     * // trimmed
     * route.path('A', 'D', { trim: true }) // => [B', 'C']
     *
     * // reversed
     * route.path('A', 'D', { reverse: true }) // => ['D', 'C', 'B', 'A']
     *
     * // include the cost
     * route.path('A', 'D', { cost: true })
     * // => {
     * //       path: [ 'A', 'B', 'C', 'D' ],
     * //       cost: 4
     * //    }
     */
    path(start, goal, options = {}) {
        // Don't run when we don't have nodes set
        if (!this.graph.size) {
            if (options.cost) return {
                path: null,
                cost: 0
            };

            return null;
        }

        const explored = new Set();
        const frontier = new Queue();
        const previous = new Map();

        let path = [];
        let totalCost = 0;

        let avoid = [];
        if (options.avoid) avoid = [].concat(options.avoid);

        if (avoid.includes(start)) {
            throw new Error(`Starting node (${start}) cannot be avoided`);
        } else if (avoid.includes(goal)) {
            throw new Error(`Ending node (${goal}) cannot be avoided`);
        }

        // Add the starting point to the frontier, it will be the first node visited
        frontier.set(start, 0);

        // Run until we have visited every node in the frontier
        while (!frontier.isEmpty()) {
            // Get the node in the frontier with the lowest cost (`priority`)
            const node = frontier.next();

            // When the node with the lowest cost in the frontier in our goal node,
            // we can compute the path and exit the loop
            if (node.key === goal) {
                // Set the total cost to the current value
                totalCost = node.priority;

                let nodeKey = node.key;
                while (previous.has(nodeKey)) {
                    path.push(nodeKey);
                    nodeKey = previous.get(nodeKey);
                }

                break;
            }

            // Add the current node to the explored set
            explored.add(node.key);

            // Loop all the neighboring nodes
            const neighbors = this.graph.get(node.key) || new Map();
            neighbors.forEach((nCost, nNode) => {
                // If we already explored the node, or the node is to be avoided, skip it
                if (explored.has(nNode) || avoid.includes(nNode)) return null;

                // If the neighboring node is not yet in the frontier, we add it with
                // the correct cost
                if (!frontier.has(nNode)) {
                    previous.set(nNode, node.key);
                    return frontier.set(nNode, node.priority + nCost);
                }

                const frontierPriority = frontier.get(nNode).priority;
                const nodeCost = node.priority + nCost;

                // Otherwise we only update the cost of this node in the frontier when
                // it's below what's currently set
                if (nodeCost < frontierPriority) {
                    previous.set(nNode, node.key);
                    return frontier.set(nNode, nodeCost);
                }

                return null;
            });
        }

        // Return null when no path can be found
        if (!path.length) {
            if (options.cost) return {
                path: null,
                cost: 0
            };

            return null;
        }

        // From now on, keep in mind that `path` is populated in reverse order,
        // from destination to origin

        // Remove the first value (the goal node) if we want a trimmed result
        if (options.trim) {
            path.shift();
        } else {
            // Add the origin waypoint at the end of the array
            path = path.concat([start]);
        }

        // Reverse the path if we don't want it reversed, so the result will be
        // from `start` to `goal`
        if (!options.reverse) {
            path = path.reverse();
        }

        // Return an object if we also want the cost
        if (options.cost) {
            return {
                path,
                cost: totalCost,
            };
        }

        return path;
    }

    /**
     * @deprecated since version 2.0, use `Graph#path` instead
     */
    shortestPath(...args) {
        return this.path(...args);
    }

}