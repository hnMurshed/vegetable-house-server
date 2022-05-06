const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.kz7t2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log('mongodb connected working after securing user and pass');
  client.close();
});

const run = async () => {
    try {
        app.get('/testmongo', (req, res) => {
            res.send('Mongo testing is successful. It is working')
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