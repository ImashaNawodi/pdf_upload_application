const router = require('express').Router();
const { upload, viewAllPdfs, previewPdf,downloadPdf,deletePdf } = require('../controller/pdfController');
const uploads = require('../middleware/multer');

// Route to upload a PDF
router.post("/upload/:accountId", uploads.single('file'), (req, res) => {
    console.log("Received a request to create a guidance:", req.body);
    upload(req, res);
});

// Route to view all PDFs for a specific user
router.get('/view-all-pdf/:accountId', viewAllPdfs);

// Route to view a specific PDF
router.get('/viewPdf/:id', previewPdf);
router.get("/download/:id", downloadPdf);
router.delete("/delete/:id", deletePdf);

  module.exports = router;