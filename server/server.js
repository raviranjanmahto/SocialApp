const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

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
