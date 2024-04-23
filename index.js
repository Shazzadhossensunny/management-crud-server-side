const express = require('express')
const app = express()
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.MANAGEMENT_USER}:${process.env.MANAGEMENT_PASS}@cluster0.5kgqkgx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database = client.db("managementDB");
    const managementCollection = database.collection("user");

    app.get('/users', async(req, res)=>{
        const cursor = managementCollection.find()
        const result = await cursor.toArray()
        res.send(result)

    })

    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await managementCollection.findOne(query)
      res.send(result)

    })

   app.post('/users', async(req, res)=>{
    const user = req.body
    const result = await managementCollection.insertOne(user)
    res.send(result)
   })

   app.put('/users/:id', async(req, res)=>{
    const id = req.params.id
    const user = req.body
    console.log(user)
    const filter = {_id : new ObjectId(id)}
    const options = {upsert: true}
    const updateUser = {
      $set: {
        name : user.name,
        email : user.email,
        Gender : user.Gender,
        Status : user.Status
      }
    }
    const result = await managementCollection.updateOne(filter, updateUser, options)
    res.send(result)
   })


   app.delete('/users/:id', async(req, res) => {
    const id = req.params.id
    const query = { _id : new ObjectId(id)}
    const result = await managementCollection.deleteOne(query)
    res.send(result)
   })




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
    res.send('User management system')
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })