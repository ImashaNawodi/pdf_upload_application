const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const userRoutes = require('./routes/userRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
require('express-async-errors');
require('dotenv').config();
require('./database/database');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const PORT = process.env.PORT || 8000;

app.use('/user', userRoutes);
app.use('/pdf', pdfRoutes);

app.listen(PORT, () => {
    console.log(`The server is listening on port: ${PORT}`);
  });