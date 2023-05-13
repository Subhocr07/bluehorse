const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 7000;
const connectToDb = require("./db.js");
const userRoute = require("./Routes/userRoutes.js");
const taskRoute = require("./Routes/taskRoutes.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb();

app.listen(PORT, (err) => {
  !err ? console.log(`server listening on ${PORT}`) : console.log(err);
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/user", userRoute);
app.use("/user/tasks", taskRoute);
