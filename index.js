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
    } finally {
        // client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("listening to port ", port);
});
