const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pdfSchema = new Schema({
  accountId: {
    type: String,
    required: true, 
},
  name:{
    type: String,
  }, 
  file: {
    type: String,
    required: [true,"please provide a file"]
  },
  
  
}, {
  timestamps: true,
});

// In guidanceDoc.js model file
module.exports = mongoose.model('pdfdoc', pdfSchema);

