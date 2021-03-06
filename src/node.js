export default class NetWorkNode {
    constructor(obj, db) {
        this.db = db
 
        this.x = obj.p[0]
        this.y = -obj.p[1]
        this._size = obj.s
        this.label = obj.l
        this._color = obj.c
        this.otherNode = obj.n
        this.id = obj.i

        this.db.add(this.id, this.label)
    }

    get size() {
        return this._size / 4
    }

    get color() {
        function rgb2hex(rgb) {
            rgb = rgb.match(
                /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
            );
            return rgb && rgb.length === 4 ?
                "#" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) :
                "";
        }
        return rgb2hex(`rgb(${this._color[0]}, ${this._color[1]}, ${this._color[2]})`)
    }

}