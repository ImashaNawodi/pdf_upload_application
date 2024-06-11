const Pdf = require("../model/pdfModel");

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
  const pdfId = req.params.id;

  try {
    const pdf = await Pdf.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({ status: "PDF not found" });
    }

    res.status(200).json(pdf);
  } catch (err) {
    console.error("Error in previewPdf:", err.message);
    res.status(500).json({ status: "Error with getting PDF", error: err.message });
  }
};
