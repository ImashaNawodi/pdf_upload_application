import React, { useState, useEffect } from "react";
import { MdSimCardDownload, MdPreview, MdDelete } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AllPdfTable = () => {
    const [pdfs, setPdfs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    const filteredPdfs = pdfs.filter((pdf) =>
        pdf.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      const itemsPerPage = 15;
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentPdfs = filteredPdfs.slice(indexOfFirstItem, indexOfLastItem);
    
      const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
      };
    
      const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      };
    const handleDownload = async (id) => {
        try {
          const response = await axios.get(
            `http://localhost:8000/pdf/download/${id}`,
            {
              responseType: "blob",
            }
          );
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement("a");
          a.href = url;
          a.download = "downloaded-pdf.pdf";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (error) {
          console.error("Error downloading pdf:", error);
        }
      };
  return (
    <div className="overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg">
    <table className="min-w-full">
      <thead className="text-xs text-white uppercase bg-NeutralBlack dark:text-gray-400">
        <tr>
          <th className="px-6 py-2 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider">
            No
          </th>
          <th className="px-6 py-2 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider"
>
            File Name
          </th>
          <th className="px-6 py-2 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider"                              
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-300">
        {loading ? (
          <tr>
            <td colSpan="3" className="text-center py-6">
              <div role="status" className="flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="animate-spin h-5 w-5 mr-3 text-blue-600"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 4c-1.1 0-2 .9-2 2s.9 2 2 2c.3 0 .5-.2.5-.5s-.2-.5-.5-.5c-.6 0-1-.4-1-1s.4-1 1-1c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2c0-1.1.9-2 2-2s2 .9 2 2v.6c0 .3.2.5.5.5s.5-.2.5-.5V6c0-1.7-1.3-3-3-3zm-6.3 1.7c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4C4.7 7.9 4 9.3 4 11s.7 3.1 1.7 4.3c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4-1.3-1.4-2.1-3.3-2.1-5.3s.8-3.9 2.1-5.3c.4-.4.4-1 0-1.4zm13.6 1.4c-.4-.4-1-.4-1.4 0-1.3 1.3-2.1 3.2-2.1 5.3s.8 3.9 2.1 5.3c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4-1-1.2-1.7-2.6-1.7-4.3s.7-3.1 1.7-4.3c.4-.4.4-1 0-1.4z"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </td>
          </tr>
        ) : (
          currentPdfs.map((pdf, index) => (
            <tr key={pdf.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              <td className="px-6 py-1 whitespace-nowrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-800">
                  {index + indexOfFirstItem + 1}
                </div>
              </td>
              <td className="px-6 py-1 whitespace-nowrap border-b border-gray-500">
                <div className="text-sm leading-5 text-blue-900 truncate"                       
                            
                              >
                  {pdf.name}
                </div>
              </td>
              <td className="px-6 py-1 whitespace-nowrap border-b border-gray-500">
                <div className="flex  ">
                  <Link
                    to={`/ViewPdf/${pdf._id}`}
                    className="px-2 py-1 text-sm text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <MdPreview className="text-2xl text-green-600" />
                  </Link>
                  
                  <Link
                    to={`/DeletePdf/${pdf._id}`}
                    className="px-2 py-1 text-sm text-red-500 flex items-center"
                  >
                    <MdDelete className="text-2xl text-red-600" />
                  </Link>
                  <button
                    className="px-2 py-1 text-sm text-blue-500 hover:text-blue-700 flex items-center"
                    onClick={() => handleDownload(pdf._id)}
                  >
                    <MdSimCardDownload className="text-2xl text-blue" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  )
}

export default AllPdfTable