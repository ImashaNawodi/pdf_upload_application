const asyncHandler = require('express-async-handler');
const Pdf = require('../model/pdfModel');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb('Only PDF files are allowed!', false);
    }
  },
});

// @desc    Upload PDF file
// @route   POST /api/pdfs
// @access  Private
const uploadPdf = upload.single('pdf');

const createPdf = asyncHandler(async (req, res) => {
  const { originalname, filename, size } = req.file;
  const pdf = await Pdf.create({
    user: req.user._id,
    filename: originalname,
    path: filename,
    size,
  });

  if (pdf) {
    res.status(201).json(pdf);
  } else {
    res.status(400);
    throw new Error('Invalid PDF data');
  }
});

// @desc    Get all PDFs
// @route   GET /api/pdfs
// @access  Private
const getPdfs = asyncHandler(async (req, res) => {
  const pdfs = await Pdf.find({ user: req.user._id });
  res.json(pdfs);
});

module.exports = {
  uploadPdf,
  createPdf,
  getPdfs,
};
