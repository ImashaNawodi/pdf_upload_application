import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdSimCardDownload, MdPreview, MdDelete } from "react-icons/md";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import Pagination from "../components/Pagination";

const UserHome = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  const { accountId } = useParams();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/pdf/view-all-pdf/${accountId}`)
      .then((response) => {
        setPdfs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pdf:", error);
        setLoading(false);
      });
  }, [accountId]);

  const filteredPdfs = pdfs.filter((pdf) =>
    pdf.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 5;
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

  const handleClick = () => {
    logout();
    navigate("/");
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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

  const handleUploadClick = () => {
    navigate(`/UploadPdf/${accountId}`);
  };

  return (
    <div>
      <div
        className="h-screen flex justify-center items-center bg-cover bg-center"
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
        <div className="absolute top-0  mt-5 right-40">
          <img
            src="/assets/profile.png"
            alt="Profile Icon"
            className="h-10 w-10 rounded-full cursor-pointer"
            onClick={toggleDropdown}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
              <Link
                to={`/home/${accountId}`}
                className="block px-4 py-2 bg-gray-300 text-gray-800"
              >
                Account Id : {accountId}
              </Link>
              <Link
                to={`/changePassword/${accountId}`}
                className="block px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-400"
              >
                Change Password
              </Link>
              <Link
                to={`/deleteAccount/${accountId}`}
                className="block px-4 py-2 bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Delete Account
              </Link>
            </div>
          )}
        </div>
        <div className="p-2 w-full max-w-6xl">
          {user ? (
            <>
              <button
                onClick={handleClick}
                className="absolute bg-red-600 hover:bg-red-700 text-white p-3 top-0 right-0 mt-3 mr-5  py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Log out
              </button>
              <p className="text-3xl text-white mt-3">Hello, {user.fullName}</p>
            </>
          ) : (
            <div className="absolute top-0 right-0 mt-3 mr-5">
              <button className="bg-red-600 hover:bg-red-700 text-white p-3  py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                <a href="login">Sign In</a>
              </button>
            </div>
          )}

          <div className="text-center">
            <h1 className="text-5xl font-bold text-white">
              Welcome to PDF Manager
            </h1>
            <p className="text-2xl text-white mt-4">
              Manage your PDFs with ease and security
            </p>
            <p className="text-lg text-gray-200 mt-2">
              This platform allows you to upload, view, and manage your PDF
              documents effortlessly. Join us today to experience seamless
              document management.
            </p>
          </div>
          <div className="reservation-list-container mt-8">
            <div className="-my-2 py-1 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8">
              <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h2
                      className="font-semibold text-white"
                      style={{ fontSize: "24px" }}
                    >
                      <i className="fa-solid fa-file-pdf fa-xl"></i> PDF List
                    </h2>
                  </div>
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <div className="flex justify-end gap-4">
                      <div className="relative flex items-center">
                        <div className="relative">
                          <button
                            type="submit"
                            className="absolute left-0 top-0 flex items-center justify-center h-full px-3"
                          >
                            <svg
                              className="text-gray-600 h-4 w-4 fill-current mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              version="1.1"
                              id="Capa_1"
                              x="0px"
                              y="0px"
                              viewBox="0 0 56.966 56.966"
                              style={{
                                enableBackground: "new 0 0 56.966 56.966",
                              }}
                              xmlSpace="preserve"
                              width="512px"
                              height="512px"
                            >
                              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                            </svg>
                          </button>
                        </div>
                        <input
                          className="border-2 border-gray-300 bg-white h-10 px-10 pr-16 rounded-lg text-sm focus:outline-none flex-grow"
                          type="search"
                          name="search"
                          placeholder="Search by File Name"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                      <button
                        className="bg-black  text-white py-2 px-4 rounded-md"
                        onClick={handleUploadClick}
                      >
                        Upload PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="border-t border-black-500 my-3  " />

              <div className="overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg">
                <table className="min-w-full">
                  <thead className="text-xs text-black uppercase bg-NeutralBlack ">
                    <tr>
                      <th className="px-6 py-2 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider">
                        No
                      </th>
                      <th className="px-6 py-2 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider">
                        File Name
                      </th>
                      <th className="px-6 py-2 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider">
                        Create At
                      </th>
                      <th className="px-6 py-2 border-b-2 border-gray-300 text-left text-sm leading-4 tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="text-center py-6">
                          <div
                            role="status"
                            className="flex items-center justify-center"
                          >
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
                        <tr
                          key={pdf.id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-100"
                          }
                        >
                          <td className="px-6 py-1 whitespace-nowrap border-b border-gray-500">
                            <div className="text-sm leading-5 text-gray-800">
                              {index + indexOfFirstItem + 1}
                            </div>
                          </td>
                          <td className="px-6 py-1 whitespace-nowrap border-b border-gray-500">
                            <div className="text-sm leading-5 text-blue-900 truncate">
                              {pdf.name}
                            </div>
                          </td>
                          <td className="px-6 py-1 whitespace-nowrap border-b border-gray-500">
                            <div className="text-sm leading-5 text-blue-900 truncate">
                              {new Date(pdf.createdAt).toLocaleDateString()}{" "}
                              {new Date(pdf.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-1 whitespace-nowrap border-b border-gray-500">
                            <div className="flex  ">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/ViewPdf/${pdf.accountId}/${pdf._id}`,
                                    {
                                      state: { pdfName: pdf.name },
                                    }
                                  )
                                }
                                className="px-2 py-1 text-sm text-blue-500 hover:text-blue-700 flex items-center"
                              >
                                <MdPreview className="text-2xl text-green-600" />
                              </button>

                              <Link
                                to={`/DeletePdf/${pdf.accountId}/${pdf._id}`}
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

              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredPdfs.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
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

export default UserHome;
