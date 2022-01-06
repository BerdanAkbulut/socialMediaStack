const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");


const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
dotenv.config();

mongoose.connect(
  "mongodb+srv://bedo123:bedo1234@cluster0.lijeo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  () => {
    console.log("Mongo Db connected");
  }
);

mongoose.connection.on("error", (err) => {
  console.log(err);
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors({ origin: "*" }));






app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(8000, () => {
  console.log("Backend server is running");
});
