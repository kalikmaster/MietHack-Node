const express = require('express')
const app = express()
require('dotenv').config();
const { MongoClient } = require("mongodb");

const uri = process.env.URI

const client = new MongoClient(uri);

app.post('/forms/:type/:id', async (req, res) => {
    res.send('test')
})

app.get('/', async (req, res) => {
    res.send('test')
})

module.exports = app