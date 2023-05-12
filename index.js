const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2zpf1s.mongodb.net/?retryWrites=true&w=majority`;


// Midddleware
app.use(cors());
app.use(express.json());



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


        const coffeeCollection = client.db("coffeesDB").collection("coffees");
        app.get('/coffees', async (req, res) => {
            const coffees = coffeeCollection.find();
            const result = await coffees.toArray();
            res.send(result);
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const coffee = await coffeeCollection.findOne(query);
            res.send(coffee);
        })


        app.post('/coffees', async (req, res) => {
            const coffee = req.body;
            console.log('new coffee', coffee)
            const result = await coffeeCollection.insertOne(coffee);
            res.send(result);
        })
        app.put('/updateCoffee/:id', async (req, res) => {
            const id = req.params.id;
            const coffee = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCoffee = {
                $set: {
                    name: coffee.name,
                    quantity: coffee.quantity,
                    supplier: coffee.supplier,
                    taste: coffee.taste,
                    category: coffee.photo,
                    details:coffee.details,
                    photo:coffee.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, updatedCoffee, options);
            res.send(result);
        })
        app.delete('/coffee/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id: new ObjectId(id)}
            const result=await coffeeCollection.deleteOne(query);
            res.send(result);
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
    res.send('coffee server is running')
})

app.listen(port, () => {
    console.log('coffee server is running on port', port)
})