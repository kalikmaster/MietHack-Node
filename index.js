const express = require('express')
const app = express()
const CryptoJS = require('crypto-js');
bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('view engine', 'ejs');

require('dotenv').config();
const { MongoClient, ObjectId} = require('mongodb');
const uri = process.env.URI
const client = new MongoClient(uri);
const database = client.db('autodoor');
const forms = database.collection('forms');
const sessions = database.collection('sessions');
const validate = require('./validate.js')

app.post('/forms/load/:type/:id', async (req, res) => {
    res.header('Content-Type', 'application/json')
    let r = await sessions.findOne({user_id: req.body.id})
    console.log(r)
    if (req.body.token !== r.token) {
        res.send(JSON.stringify({success: false, message: 'Отказано в доступе'}))
    }
    const form = database.collection(req.params.type)
    const query = { user: req.params.id }
    console.log(query)
    console.log(req.params.type)
    const result = await form.findOne(query)
    console.log(result)
    if (result) {
        res.send(JSON.stringify({success: true, obj: result}))
    } else {
        res.send(JSON.stringify({ success: false, message: 'Данной формы нет в БД'}))
    }
})

app.post('/forms/load/:type', async (req, res) => {
    res.header('Content-Type', 'application/json')
    let r = await sessions.findOne({user_id: req.body.id})
    console.log(r)
    if (req.body.token !== r.token) {
        res.send(JSON.stringify({success: false, message: 'Отказано в доступе'}))
    }
    const query = { title: req.params.type }
    const form = await forms.findOne(query);
    console.log(query)
    console.log(form)
    res.send(JSON.stringify({ success: true, form: form.fields }))
})

app.get('/forms/:type/:id', async (req, res) => {
    const query = { title: req.params.type }
    const form = await forms.findOne(query);
    res.render('form', { form_type: req.params.type, form_id: req.params.id })
})

app.post('/validate', async  (req, res) => {
    res.header('Content-Type', 'application/json')
    if (await validate(req.body.initData)) {
        const initData = new URLSearchParams(req.body.initData);
        const user = JSON.parse(initData.get('user'))
        const id = user.id
        const query = { user_id: id }
        const result = await sessions.findOne(query);
        const token = CryptoJS.SHA256(id.toString() + process.env.API_TOKEN).toString(CryptoJS.enc.Hex)
        if (!result) {
            const session = { user_id: id, token: token, redacting: false }
            await sessions.insertOne(session)
        }
        res.send(JSON.stringify({
            success: true,
            token: token,
            id: id,
        }))
    } else {
        res.send(JSON.stringify({ success: false }))
    }
})

app.post('/id/new', async (req, res) => {
    res.header('Content-Type', 'application/json')
    let r = await sessions.findOne({user_id: req.body.id})
    console.log(r)
    if (req.body.token !== r.token) {
        res.send(JSON.stringify({success: false, message: 'Отказано в доступе'}))
    }
    answers = database.collection('answers')
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;

    answer = { name: req.body.type, user: req.body.user_id, date: currentDate, content: {} }
    result = await answers.insertOne(answer)
    res.send(JSON.stringify({id: result}))

})

app.get('/', async (req, res) => {
    res.send('test')
})

//app.listen(80)
module.exports = app
