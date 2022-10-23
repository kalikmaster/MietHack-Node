const express = require('express')
const app = express()
bodyParser = require('body-parser');
app.use(bodyParser.json());
app.set('view engine', 'ejs');

require('dotenv').config();
const { MongoClient, ObjectId} = require('mongodb');
const uri = process.env.URI
const client = new MongoClient(uri);
const database = client.db('autodoor');
const forms = database.collection('forms');
const validate = require('./validate.js')

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
    if (validate(req.body.initData)) {
        const initData = new URLSearchParams(req.body.initData);
        const user = initData.get('user')
        res.send(JSON.stringify({
            success: true,
            user: user
        }))
    } else {
        res.send(JSON.stringify({ success: false }))
    }
})

app.get('/', async (req, res) => {
    res.send('test')
})

//app.listen(80)
module.exports = app
