const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js')

app.use(bodyParser.json());
app.set('view engine', 'ejs');

// require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb+srv://test:KiUsJR6iISbaZQis@miethack.vhgol0b.mongodb.net/test'
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
    res.header('Access-Control-Allow-Origin', '*')
    let data_check_string = req.body.data_check_string
    let _hash = req.body.hash
    let secret_key = CryptoJS.HmacSHA256("bot_token", "WebAppData")
    if (CryptoJS.HmacSHA256(data_check_string, secret_key) === _hash) {
        res.send(JSON.stringify(CryptoJS.HmacSHA256(data_check_string, secret_key)))
    } else {
        res.send(_hash)
    }
})

app.get('/', async (req, res) => {
    res.send('test')
})

app.listen(80)
module.exports = app
