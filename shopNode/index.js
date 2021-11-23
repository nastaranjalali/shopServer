const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
require("dotenv/config");
var cors = require("cors");
//import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/panel");
const mainRoutes = require("./routes/main");

var app = express();
app.use(cors());
const server = http.createServer(app);

// config request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION, () =>
  console.log("connected to db")
);
app.use(express.static("public"));

//use routse
app.use("/auth", authRoutes);
app.use("/main", mainRoutes);
app.use("/panel", userRoutes);

app.get("/", (req, res) => {
  res.send("it's index");
});

server.listen(3001, () => console.log("server started at port 3001"));
