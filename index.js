import  express, { request, response }  from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
const app = express()


dotenv.config();
const PORT = process.env.PORT;

// Tell express what format data you are going to get - json, xml, text
// middleware - gatekeeper

app.use(express.json());

// express.json() - inbuilt middleware
// 3rd party, custom middleware
console.log(process.env)
// password - url hide the url
async function createConnection() {
    // const MONGO_URL = "mongodb://127.0.0.1:27017";
    // const MONGO_URL = "mongodb://localhost/users";
    const MONGO_URL = process.env.MONGO_URL;
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Successfully Connected!!!!")
    // const insertdata = await client.db("users").collection("people").insertMany(users);
    return client;
    // const user = await client.db("users").collection("people").findOne({id: "5"})
    // console.log(user) 
    // db.people.find()
}

createConnection();

// C - Create = post
// R - Read = get
// U - Update = put/patch
// D - Delete = delete

app.get("/", (request,response) => {
    response.send("Hello all");
})

// Get all the user  
app.get("/users", async (request, response) => {
    const client = await createConnection();
    const user = await client.db("users").collection("people").find({}).toArray()
    console.log(user) 
    response.send(user);
})

// Get the user by id
app.get("/users/:id", async (request, response) => {
    console.log(request.params);
    const id = request.params.id;
    const client = await createConnection();
    const user = await client.db("users").collection("people").findOne({id: id})
    console.log(user) 
    response.send(user);
    // response.send(users.filter((user) => user.id === id));
})

// Delete the user
app.delete("/users/:id", async (request, response) => {
    console.log(request.params);
    const id = request.params.id;
    const client = await createConnection();
    const user = await client.db("users").collection("people").deleteOne({id: id})
    console.log(user) 
    response.send(user);
})

// Identify the person, new data (new color)
app.patch("/users/:id", async (request, response) => {
    console.log(request.params);
    const { id } = request.params;
    const client = await createConnection();
    const newData = request.body;
    console.log(id, request.body);
    const user = await client.db("users").collection("people").updateOne({id: id}, { $set: newData });
    console.log(user) 
    response.send(user);
})

// Create a user
app.post("/users",async (request,response) => {
    const client = await createConnection();
    const addUsers = request.body;
    const result = await client.db("users").collection("people").insertMany(addUsers);
    console.log(addUsers, result);
    response.send(result);
});

// app.get("/users",async (request,response) => {
//     const { color,age } = request.query;
//     // console.log(request.query);
//     const client = await createConnection();
//     const users = await client.db("users").collection("people");
//     if(!color && !age){
//         users.find({}).toArray();
//     }else if(color && !age){
//         users.find({ color: color });
//     }
//     else if(!color && age){
//         users.find({ age: age });
//     }else {
//         users.find({ age: age },{color : color});
//     }
    
//     console.log(users);
//     response.send(users);
// })

// app.get("/users", (request,response) => {
//     const { color,agegt } = request.query;
//     console.log(request.query);
//     if(!color && !agegt){
//         response.send(users)
//     }else if(color && !agegt) {
//     response.send(users.filter((user) => user.color == color ))
//     }else if(!color && agegt) {
//         response.send(users.filter((user) => user.age > agegt ))
//     } else {
//         response.send(users.filter((user) => user.color === color && user.age > agegt))
//     }
// })


app.listen(PORT, () => {
    console.log("server started successfully!!",PORT)
})