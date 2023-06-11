
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

//middlewares:
app.use(cors())
app.use(express.json())

// jwt midleware : 
const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'unauthorized access' })
    }
    
    const token = authorization.split(' ')[1]

    
    jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
        if (error) {
            return res.status(401).send({ error: true, message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next()
    })
}


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
    const popularClassesCollection = client.db("magicDb").collection("popularClasses");
    const polularInstructorsClassesCollection = client.db("magicDb").collection("polularInstructors");

    //jwt post:
    app.post('/jwt', (req, res) => {
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '6h' })
        res.send({ token })
    })

    //popular classes and intructors api:
    app.get('/popular/classes', async(req, res) => {
        const result = await popularClassesCollection.find().toArray()
        res.send(result)
    })

    app.get('/popular/instructors', async(req, res) => {
        const result = await polularInstructorsClassesCollection.find().toArray()
        res.send(result)
    })
    
    //user api:
    app.get('/users', verifyJWT, async(req, res) => {
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