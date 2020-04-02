export default class NetWorkNode {
    constructor(obj, db, route) {
        this.db = db
        this.route = route

        this.x = obj.p[0]
        this.y = obj.p[1]
        this._size = obj.s
        this.label = obj.l
        this.color = obj.c
        this.otherNode = obj.n
        this.id = obj.i

        this.db.add(this.id, this.label)
        this.route.addNode(this.id, { [this.otherNode]: 1 })
    }

    getRGB() {
        return this.color.map(c => c / 255)
    }

    get size() {
        return this._size / 4
    }
}