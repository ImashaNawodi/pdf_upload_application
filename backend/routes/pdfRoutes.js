const express = require('express');
const router = express.Router();
const { uploadPdf, createPdf, getPdfs } = require('../controller/pdfController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, uploadPdf, createPdf).get(protect, getPdfs);

module.exports = router;
