import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="block">
      <ul className="flex pl-0 rounded list-none flex-wrap">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              className={`relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-800 mr-1 mb-1 hover:bg-gray-200 hover:border-gray-400 focus:outline-none ${
                currentPage === number
                  ? "bg-gray-300 border-gray-400"
                  : "bg-white"
              }`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
