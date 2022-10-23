const express = require('express')
const app = express()
const CryptoJS = require('crypto-js');
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
const validate = require('./validate.js')

app.get('/forms/:type/:id', async (req, res) => {
    //const dorogi = database.collection('Dorogi');
    //const query = { _id: ObjectId('63540e516dd4c687d64366f8') };
    const query = { title: req.params.type }
    const form = await forms.findOne(query);
    res.render('form', { form: form.fields })
})


app.post('/validate', async  (req, res) => {
    res.header('Content-Type', 'application/json')
    if (validate(req.body.initData)) {
        const initData = new URLSearchParams(req.body.initData);
        const user = JSON.parse(initData.get('user'))
        const id = user.id
        const query = { user_id: id }
        const result = sessions.findOne({query});
        let redacting = false
        const token = CryptoJS.SHA256(id.toString() + process.env.API_TOKEN).toString(CryptoJS.enc.Hex)
        if (result._id) {
            redacting = result.redacting
        } else {
            const session = { user_id: id, token: token, redacting: false }
            await sessions.insertOne(session)
        }
        res.send(JSON.stringify({
            success: true,
            token: token,
            redacting: redacting
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
