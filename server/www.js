const app = require('./app')

app.listen(8080, (err) => {
    if (err) return console.log(err)
    console.log('App listening on port 8080!')
})