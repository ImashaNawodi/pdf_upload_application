const Pdf = require("../model/pdfModel");
const path = require("path");
const fs = require("fs");

// Upload a PDF file
exports.upload = async (req, res) => {
  const accountId = req.params.accountId;

  try {
    const { name } = req.body;

    // Check if req.file is defined
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file.path;

    // Log the file path to ensure it's correct
    console.log("File path:", file);

    // Split the file path string using backslash as delimiter
    const filePathParts = file.split("\\");

    // Get the last part of the array, which is the file name
    const fileNameWithTimestamp = filePathParts[filePathParts.length - 1];

    // Split the file name using underscore as delimiter
    const fileNameParts = fileNameWithTimestamp.split("_");

    // Get the second part of the array, which is the actual file name
    const actualName = fileNameParts.slice(1).join("_");

    console.log("Actual File Name:", name);

    // Rest of your code for creating and saving the pdf
    const newPdf = new Pdf({ name: name ? name : actualName, file, accountId });

    // Log the new pdf object to ensure it's correct
    console.log("New pdf:", newPdf);

    // Save the data in the database
    await newPdf.save();

    console.log("Saved to the database");
    res.json({ pdf: newPdf, message: "File successfully uploaded" });
  } catch (error) {
    console.error("Error saving pdf:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// View all PDFs for a particular user
exports.viewAllPdfs = async (req, res) => {
  const accountId = req.params.accountId;

  try {
    // Find PDFs based on the account ID
    const pdfs = await Pdf.find({ accountId });

    res.json(pdfs);
  } catch (error) {
    console.error("Error in viewAllPdfs:", error);
    // Handle errors and send an appropriate response
    res.status(500).json({ error: error.message });
  }
};

// View one specific PDF for a particular user
exports.previewPdf = async (req, res) => {
  try {
    const pdfId = req.params.id;

    // Await the asynchronous call to find the guidance document
    const pdf = await Pdf.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({ status: "pdf not found" });
    }

    const file = pdf.file;
    const pdfFilePath = path.join(__dirname, "..", file);

    // Check if the file exists
    if (!fs.existsSync(pdfFilePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set the content type header
    res.setHeader("Content-Type", "application/pdf");

    // Stream the file to the response
    const stream = fs.createReadStream(pdfFilePath);
    stream.pipe(res);
  } catch (error) {
    console.error("Error viewing PDF:", error);
    res.status(500).send("An error occurred while viewing the PDF");
  }
};

exports.downloadPdf = async (req, res) => {
  try {
    const pdfId = req.params.id;

    const pdf = await Pdf.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({ status: "notice not found" });
    }

    const file = pdf.file;
    const filepath = path.join(__dirname, `../${file}`);

    res.download(filepath);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "Error while downloading notice", error: err.message });
  }
};

// delete pdf
exports.deletePdf = async (req, res) => {
  let pdfId = req.params.id;
  try {
    // Use await here to wait for the deletion to complete
    await Pdf.findByIdAndDelete(pdfId);
    res.status(200).send({ status: "notice deleted" });
  } catch (err) {
    // Use status 500 for server errors
    res
      .status(500)
      .send({ status: "Error with delete notice", error: err.message });
  }
};
