const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
require('express-async-errors');
require('dotenv').config();
require('./database/database');
const PORT = process.env.PORT || 8000;



app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`The server is listening on port: ${PORT}`);
  });