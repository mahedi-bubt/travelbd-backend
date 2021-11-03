const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h1fbe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        /* console.log('connected to database'); */
        const database = client.db('travelbd');
        const packagesCollection = database.collection('packages');
        const placeOrderCollection = database.collection('placeorder');

        //GET API
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        //GET Single Services
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id: ', id);
            const query = { _id: ObjectId(id) }
            const result = await packagesCollection.findOne(query);
            res.json(result);

        });

        //GET PlaceOrder data
        app.get('/placeorder', async (req, res) => {
            const cursor = placeOrderCollection.find({});
            const placeorders = await cursor.toArray();
            res.send(placeorders);
        });

        //POST API
        app.post('/packages', async (req, res) => {
            const package = req.body;
            console.log('hit the post api', package);
            const result = await packagesCollection.insertOne(package);
            console.log(result);
            res.json(result);
        })

        //PlaceOrder POST API
        app.post('/placeorder', async (req, res) => {
            const order = req.body;
            console.log('hit the PlaceOrder post api', order);
            const result = await placeOrderCollection.insertOne(order);
            console.log(result);
            res.json(result);
        })

        //DELETE API
        app.delete('/placeorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await placeOrderCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my crud server');
});

app.listen(port, () => {
    console.log('Running server port ', port);
})