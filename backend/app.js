const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// iske neeche daal apne routes -

module.exports = app;
