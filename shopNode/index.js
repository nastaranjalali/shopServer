const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
require("dotenv/config");
//import routes
const authRoutes = require("./routes/auth");

var app = express();

const server = http.createServer(app);

// config request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION, () =>
  console.log("connected to db")
);
//use routse
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("it's index");
});

server.listen(3000, () => console.log("server started at port 3000"));
