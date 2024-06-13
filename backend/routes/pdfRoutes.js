const router = require('express').Router();
const { upload, viewAllPdfs, previewPdf,downloadPdf,deletePdf } = require('../controller/pdfController');
const uploads = require('../middleware/multer');

// Route to upload a PDF
router.post("/upload/:accountId", uploads.single('file'), (req, res) => {
    console.log("Received a request to upload a file:", req.body);
    upload(req, res);
});

// Route to view all PDFs for a specific user
router.get('/view-all-pdf/:accountId', viewAllPdfs);

// Route to view a specific PDF
router.get('/viewPdf/:id', previewPdf);

// Route to downlaod a specific PDF
router.get("/download/:id", downloadPdf);

// Route to delete a specific PDF
router.delete("/delete/:id", deletePdf);

module.exports = router;