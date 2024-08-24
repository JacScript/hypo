"use strict";

// //imports
const express = require("express");
const application = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
application.use(cookieParser());
dotenv.config();
application.use(express.json());
application.use(express.urlencoded({ extended: true }));



var jsonParser = require("body-parser").json; //has multiple parse to manage http request
var logger = require("morgan");


const port = process.env.PORT || 8000;


async function connectWithRetry() {
  try {
    //connecting to mongo db database
    const databaseConnected = await mongoose.connect(process.env.MONGO_URL);

    //verifying the database is connected
    if (databaseConnected) {
      application.listen(process.env.PORT, () => {
        console.log(
          `database has been connected and server is running on port ${port}`
        );
      });
    } else {
      console.log("Database connection  failed");
      setInterval(connectWithRetry, 5000);
    }
  } catch (error) {
    console.log(`Database connection error: ${error}`);
    setInterval(connectWithRetry, 5000);
  }
}

connectWithRetry();
