import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "../../../hooks/useLogout";
import { useAuthContext } from "../../../hooks/useAuthContext";

// Set workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ViewPdf = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const { pdfId } = useParams();
  const { accountId } = useParams();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();
  const pdfName = location.state?.pdfName || "PDF";
  const navigate = useNavigate();

  // Function to fetch PDF URL based on requestId
  const fetchPdfUrl = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/pdf/viewPdf/${pdfId}`,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfUrl);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  // Call fetchPdfUrl when component mounts
  useEffect(() => {
    fetchPdfUrl();
  }, [pdfId]);

  // Function to handle page change
  const onPageChange = ({ pageNumber }) => {
    setPageNumber(pageNumber);
  };

  // Function to handle going back to the previous page
  const goBack = () => {
    navigate(`/home/${accountId}`);
  };
  const handleClick = () => {
    logout();
    navigate("/");
  };
  return (
    <div>
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgb(0 0 0 / 60%), rgb(0 0 0 / 60%)), url('/assets/1.jpeg')",
      }}
    >
      <div className="absolute top-0 left-0 mt-5 ml-5">
        <img
          src="/assets/OIP.jpeg"
          alt="Background Image"
          className="h-20 w-20 rounded-full object-cover"
        />
      </div>
      <div className="text-4xl font-bold text-red-500 text-center my-4">
        Pdf-Viewer
        <h3 className="text-lg text-white mt-2">You Are Viewing: {pdfName}</h3>
      </div>
      <div className="flex justify-center items-center h-full mt-6">
        {user ? (
          <>
            <button
              onClick={handleClick}
              className="absolute bg-red-600 hover:bg-red-700 text-white p-3 top-0 right-0 mt-3 mr-5  py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Log out
            </button>
          </>
        ) : (
          <div className="absolute top-0 right-0 mt-3 mr-5">
            <button className="bg-red-600 hover:bg-red-700 text-white p-3  py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              <a href="login">Sign In</a>
            </button>
          </div>
        )}
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : (
          <div className="border-4 border-black rounded-lg overflow-hidden">
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onPageChange={onPageChange}
              />
            </Document>
            <div className="mt-4 flex justify-between items-center px-4">
              <p className="text-lg text-gray-600">
                Page {pageNumber} of {numPages}
              </p>
              <div className="space-x-2">
                <button
                  onClick={goBack}
                  className="py-1 px-2 rounded bg-gray-400 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={() => setPageNumber(pageNumber - 1)}
                  disabled={pageNumber <= 1}
                  className="py-1 px-2 rounded bg-green-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPageNumber(pageNumber + 1)}
                  disabled={pageNumber >= numPages}
                  className="py-1 px-2 rounded bg-green-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <hr />
      <footer className="bg-gray-900 text-white text-center py-5">
        <p>&copy; 2024 PDF Manager. All rights reserved.</p>
      </footer>
      <hr />
    </div>
  );
};

export default ViewPdf;
