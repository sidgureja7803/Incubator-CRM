import React, { useState, useEffect } from 'react';
import axios from 'utils/httpClient';
import config from "config";
import './Documents.css';

const Documents = ({ cohortId }) => {
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchDocuments();
  }, [cohortId]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${config.api_base_url}/cohort/docs/${cohortId}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
          }`,
        },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedDocuments = documents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(documents.length / rowsPerPage);

  return (
    <div className="documents-container">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Uploaded by</th>
              <th>File</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {displayedDocuments.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>
                  {doc.description}
                  {doc.description.length > 50 && (
                    <button className="read-more">Read more</button>
                  )}
                </td>
                <td>{doc.uploaded_by_name}</td>
                <td>
                  <a href={doc.file} className="view-link" target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                </td>
                <td>
                  <a href={doc.file} download className="download-button">
                    <i className="fas fa-download"></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="rows-per-page">
          <span>1-{rowsPerPage} of {documents.length}</span>
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="page-navigation">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Documents;
