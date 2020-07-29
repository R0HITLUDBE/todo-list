const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const config = require("config");

const app = express();

// bodyparser middleware
app.use(express.json());

// DB config
const db = config.get("mongoURI");

// connect to db
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));

// Serve static assests if in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// USE ROUTES
app.use("/api/items", require("./routes/api/items"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server start on port ${port}`));
