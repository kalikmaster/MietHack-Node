const express = require('express')
const app = express()

app.post('/forms/:type/:id', async (req, res) => {
    res.send('test')
})

app.get('/', async (req, res) => {
    res.send('test')
})

app.get('/:echo', async (req, res) => {
    res.send(req.params.echo)
})

module.exports = app