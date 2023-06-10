
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

//middlewares:
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.zrkl84y.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const usersCollection = client.db("magicDb").collection("users");

    app.get('/users', async(req, res) => {
        const result = await usersCollection.find().toArray()
        console.log(result);
        res.send(result)

    })

    app.post('/users', async (req, res) => {
        const userData = req.body;
        const query = { email: userData.email }
        const existingUser = await usersCollection.findOne(query)
        if (existingUser) {
            return res.send({ message: 'already have an account' })
        }
        const result = await usersCollection.insertOne(userData);
        res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Illusoria academy of megic is open now...')
})

app.listen(port, () => {
    console.log(`magic academy is runnig on port: ${port}`);
})