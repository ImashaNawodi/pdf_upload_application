const mongoose = require('mongoose');
require('dotenv').config(); 

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB is connected!');
  })
  .catch((ex) => {
    console.log('DB connection failed: ', ex);
  });
