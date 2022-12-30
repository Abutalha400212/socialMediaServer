const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://socialmedia:5ZBi3rkTjmz9cdjI@cluster0.xddzsoq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
app.use(cors());
app.use(express.json());
async function DBConnect() {
  try {
    await client.connect();
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
}
DBConnect();
const usersCollection = client.db("socialMedia").collection("users");
const postsCollection = client.db("socialMedia").collection("posts");
app.post("/users", async (req, res) => {
  const user = req.body;
  const result = await usersCollection.insertOne(user);
  res.send(result);
});
app.post("/posts", async (req, res) => {
  const post = req.body;
  const result = await postsCollection.insertOne(post);
  res.send(result);
});
app.put("/comment/:id", async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const updateDoc = {
    $push: {
      comment: comment,
    },
  };
  const result = await postsCollection.updateOne(
    { _id: ObjectId(id) },
    updateDoc
  );
  res.send(result);
});
app.get("/posts", async (req, res) => {
  const result = await postsCollection.find({}).sort({ like: -1 }).toArray();
  res.send(result);
});
app.get("/posts/:email", async (req, res) => {
  const { email } = req.query;
  const result = await postsCollection.find({ email: email }).toArray();
  res.send(result);
});
app.get("/posts-details/:reqId", async (req, res) => {
  const reqId = req.params.reqId;
  const query = reqId.toString();
  const result = await postsCollection.findOne({ _id: ObjectId(query) });
  res.send(result);
});
app.get("/users/:email", async (req, res) => {
  const { email } = req.params;
  const result = await usersCollection.findOne({ email: email });
  res.send(result);
});
app.get("/users", async (req, res) => {
  const result = await usersCollection.find({}).sort({ time: -1 }).toArray();
  res.send(result);
});
app.put("/users/:email", async (req, res) => {
  const { email } = req.params;
  const { data } = req.body;
  const updateStatus = {
    $set: data,
  };
  const result = await usersCollection.updateOne(
    { email: email },
    updateStatus
  );
  res.send(result);
});
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const like = req.body.like;
  const updateStatus = {
    $set: {
      like: like,
    },
  };
  const result = await postsCollection.updateOne(
    { _id: ObjectId(id) },
    updateStatus
  );
  res.send(result);
});
app.get("/", (req, res) => {
  res.send("server is running");
});
app.listen(port, () => {
  console.log("server is running", port);
});
