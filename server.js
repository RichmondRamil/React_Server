require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corstOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandle = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

//Connect to MongoDB

connectDB();

// Custom middleware logger
app.use(logger);

//
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corstOptions));

//Built in middle ware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//Built-in middleware for json
app.use(express.json());

//Middleware for cookies
app.use(cookieParser());

//Serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

//Routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));
app.use("/users", require("./routes/api/users"));

//app.use('/')
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandle);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
