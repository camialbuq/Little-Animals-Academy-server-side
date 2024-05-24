const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");

// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

const {
  errorHandler,
  notFoundHandler,
} = require("./error-handling/error-handling");

const app = express();

//connects to DB
mongoose
  .connect("mongodb://127.0.0.1:27017/littleacademy-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

//middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);
app.use("/", authRouter);
app.use("/", userRouter);

//ERROR Middlewares
app.use(errorHandler);
app.use(notFoundHandler);

// START SERVER
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
