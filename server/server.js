const dotenv = require("dotenv").config();
const uncaughtException = require("./helpers/uncaughtException");
// HANDLING UNCAUGHT EXCEPTION ERROR ON TOP
uncaughtException();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const unhandledRejection = require("./helpers/unhandledRejection");

const app = express();
app.use(express.json());

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const port = process.env.PORT || 7000;

// DATABASE CONNECTION
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true })
  .then(() =>
    app.listen(port, () =>
      console.log(`Database connected🥰 \nServer is running on port ${port}...`)
    )
  )
  .catch(err => console.log(`Error 🙄💥💥🙄 read message =>`, err.message));

// TO HANDLE UNHANDLED REJECTION ERROR
unhandledRejection();
