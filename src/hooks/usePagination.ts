import { useState } from 'react';

interface PaginationProps {
  items: any[]; // The full list of items (game winners in your case)
  itemsPerPage: number; // The number of items per page
}

const usePagination = ({ items, itemsPerPage }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const totalPages = Math.ceil(items.length / itemsPerPage); // Total pages based on the number of items and items per page

  // Get the records to display on the current page
  const currentRecords = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Function to set the current page and update records
  const setPagination = (newPage: number) => {
    if (newPage < 1) {
      setCurrentPage(1); // Ensure page doesn't go below 1
    } else if (newPage > totalPages) {
      setCurrentPage(totalPages); // Ensure page doesn't go above total pages
    } else {
      setCurrentPage(newPage); // Update to the new valid page
    }
  };

  return {
    currentPage,
    totalPages,
    currentRecords,
    setPagination,
  };
};

export default usePagination;
