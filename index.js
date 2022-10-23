const express = require('express')
const app = express()
bodyParser = require('body-parser');
app.use(bodyParser.json());


app.set('view engine', 'ejs');

var CryptoJS = require('crypto-js')

require('dotenv').config();
const { MongoClient, ObjectId} = require('mongodb');
const uri = process.env.URI
const client = new MongoClient(uri);
const database = client.db('autodoor');
const forms = database.collection('forms');


app.get('/forms/:type/:id', async (req, res) => {
    //const dorogi = database.collection('Dorogi');
    //const query = { _id: ObjectId('63540e516dd4c687d64366f8') };
    const query = { title: req.params.type }
    const form = await forms.findOne(query);
    console.log(form.fields)
    res.render('form', { form: form.fields })
})


app.post('/validate', async  (req, res) => {
    res.header('Content-Type', 'application/json')
    data_check_string = req.body.data_check_string
    _hash = req.body.hash
    secret_key = CryptoJS.HmacSHA256(process.env.API_TOKEN, "WebAppData")
    let str = ""
    for (let i = 0; i < 8; i++) {
        str = str + Math.abs(secret_key.words[i]).toString(16);
    }
    hash2 = CryptoJS.HmacSHA256(data_check_string, str)
    console.log(hash2)
    str = ""
    for (let i = 0; i < 8; i++) {
        str = str + Math.abs(hash2.words[i]).toString(16);
    }
    if (str === _hash) {
        res.send(JSON.stringify({success: 'Here'}))
    } else {
        res.send(JSON.stringify({success: str + '<br>' + _hash}))
    }
})

app.get('/', async (req, res) => {
    res.send('test')
})

//app.listen(80)
module.exports = app
