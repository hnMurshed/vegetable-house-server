const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();

const port = process.env.PORT || 5001;

// use middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kz7t2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);

const run = async () => {
    try {
        await client.connect();

        const itemCollection = client.db('vegeDB').collection('items');
        console.log('Mongodb working')

        // get all items
        app.get('/items', async (req, res) => {
            const page = parseInt(req.query.page);
            const count = parseInt(req.query.count);
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.skip(page*count).limit(count).toArray();

            res.send(items);
        })

        // get single item with id
        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };

            const item = await itemCollection.findOne(query);

            res.send(item);
        })

        // update item's quantity
        app.put('/increase-quanity', async (req, res) => {
            const id = req.query.id;
            const updatedquantity = req.query.updatedquantity;
            console.log(id, updatedquantity);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updatedquantity
                },
            };

            const result = await itemCollection.updateOne(filter, updateDoc, options);

            res.send(result);

        })

        // insert new item
        app.post('/insertitem', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        })

        // delete item
        app.delete('/deleteitem/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.deleteOne(query);

            res.send(result);
        })

        // just for test
        app.get('/testmongo', (req, res) => {
            res.send('Mongo testing is successful. It is working')
        })
        app.get('/testmongo2', (req, res) => {
            res.send('another test for mongo in heroku')
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Inventory management assignment server running');
})

app.listen(port, () => {
    console.log('Listening to the port', port);
})