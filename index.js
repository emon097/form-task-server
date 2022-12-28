const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("form-task api");
});

const uri =
  "mongodb+srv://form-task:Y1Bxe15Jm6H7csqj@cluster0.k9jkjo0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

try {
  // const formDetails = client.db("formTask").collection("userInfo");
  const allSector = client.db("formTask").collection("AllSector");
  const employeeInfo = client.db("formTask").collection("employeeInfo");
  const employee = client.db("formTask").collection("employeeInfo");
  app.get("/allSectors", async (req, res) => {
    const query = {};
    const cursor = allSector.find(query);
    const sector = await cursor.toArray();
    res.send(sector);
  });

  app.post("/addEmployeeInfo", async (req, res) => {
    const info = req.body;
    const employeeInfos = await employeeInfo.insertOne(info);
    res.send(employeeInfos);
  });

  app.get("/employeeDetail", async (req, res) => {
    const query = {};
    const cursor = await employee.find(query).toArray();
    res.send(cursor);
  });

  app.delete("/employeeDetail/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await employee.deleteOne(query);
    res.send(result);
  });

  app.patch("/employeeDetail/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const user = req.body;
    const option = { upsert: true };
    const updatedUser = {
      $set: {
        name: user.name,
        select: user.select,
      },
    };
    const result = await employee.updateOne(filter, updatedUser, option);
    res.send(result);
  });
} catch {}
app.listen(port, () => {
  console.log(`form-task runing on ${port} `);
});
