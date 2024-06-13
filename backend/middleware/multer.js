const multer = require("multer");
const path = require('path');
const fs = require('fs');

// Specify the destination directory for uploads
const uploadDirectory = 'uploads/';

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// configure how the files are stored
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Callback to specify where to store the file
        cb(null, uploadDirectory);
    },
    filename: function(req, file, cb) {
        // Callback to specify the file name
        cb(null, new Date().toISOString().replace(/:/g, '-') + "_" + file.originalname);
    },
});

// Function to filter files by type
const fileFilter = (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === "application/pdf") {
        cb(null, true); // Accept the file
    } else {
        cb(null, false); // Reject the file
    }
};

// Initialize multer with configuration
const uploads = multer({
    storage: storage, // Specify the storage configuration
    limits: {
        fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
    },
    fileFilter: fileFilter, // Specify the file filter function
});

module.exports = uploads;
