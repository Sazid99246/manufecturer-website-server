const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gau9b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection = client.db("rainbow-computers").collection("products");
        const reviewCollection = client.db("rainbow-computers").collection("reviews")

        // get all the products
        app.get('/product', async(req, res)=>{
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        // get specific product by id
        app.get('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        // get all reviews
        app.get('/review', async(req, res)=>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews =await cursor.toArray();
            res.send(reviews)
        })
    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("Hello from rainbow computers server")
})
app.listen(port, ()=>{
    console.log("Rainbow computers is listening from port", port);
})