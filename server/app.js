const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const ngraphPath = require('ngraph.path')
const createGraph = require('ngraph.graph')

const g = createGraph()
const app = express()

function loadData() { 
    const file = fs.readFileSync(__dirname + '/data/fullEdges.json', 'utf-8')
    const json = JSON.parse(file)
    json.map(f => g.addLink('' + f[1], '' + f[0]))
}

console.log('Loading data...')
loadData()
console.log('Data loaded !')

app.use(bodyParser.json())
app.use(cors())

app.post('/path', function (req, res) {
    const { start, end } = req.body
    const pathFinder = ngraphPath.aStar(g, {
        oriented: true
      })
    const foundPath = pathFinder.find(''+start, ''+end);
    res.json(foundPath.reverse().map(n => n.id))
})

app.use(express.static('public'))

module.exports = app