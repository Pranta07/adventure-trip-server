const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("adventure-trip server is running!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yxq3j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        // console.log("mongodb connected successfully!");
        const database = client.db("AdventureTrip");
        const toursCollection = database.collection("services");
        const ordersCollection = database.collection("orders");

        //getting all services
        app.get("/services", async (req, res) => {
            const result = await toursCollection.find({}).toArray();
            res.send(result);
        });

        //get single service with id
        app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await toursCollection.findOne(query);
            res.send(result);
        });

        //finding a user orders
        app.get("/myPlans/:email", async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = { email: email };
            const result = await ordersCollection.find(query).toArray();
            res.json(result);
        });

        //get all orders
        app.get("/managePlans", async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.json(result);
        });

        //POST API for recieving orders
        app.post("/takeOrders", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });

        //post api for adding new item
        app.post("/addNewPlans", async (req, res) => {
            const doc = req.body;
            // console.log(doc);
            const result = await toursCollection.insertOne(doc);
            res.json(result);
        });

        //UPDATE status api
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "Approved",
                },
            };

            const result = await ordersCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.json(result);
        });

        //delete tour plan
        app.delete("/remove/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });
    } finally {
        // client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("listening to port ", port);
});
