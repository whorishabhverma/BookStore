import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import { X } from 'lucide-react'; // Import X icon from lucide-react

// Set worker source directly
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const ReadBook = ({ pdfUrl, buttonText = "Read Book" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const openBook = () => {
    setIsOpen(true);
    setError(null);
  };

  const closeBook = () => {
    setIsOpen(false);
    setPageNumber(1);
    setError(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error) => {
    setError('Error loading PDF. Please check if the file exists and is accessible.');
    setIsLoading(false);
    console.error('PDF Load Error:', error);
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  const onLoading = () => {
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={openBook}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        {buttonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center p-4 overflow-auto z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close button in the top-right corner */}
            <button
              onClick={closeBook}
              className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              aria-label="Close PDF viewer"
            >
              <X size={20} />
            </button>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">PDF Viewer</h2>
            </div>

            {error ? (
              <div className="text-red-600 mb-4">{error}</div>
            ) : (
              <div className="flex flex-col items-center">
                {isLoading && (
                  <div className="mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
                
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  onLoadProgress={onLoading}
                  className="mb-4"
                  loading={
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  }
                >
                  <Page 
                    pageNumber={pageNumber}
                    className="border shadow-lg"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    loading={
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    }
                  />
                </Document>

                {numPages && (
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={goToPrevPage}
                      disabled={pageNumber <= 1}
                      className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <p className="text-gray-700">
                      Page {pageNumber} of {numPages}
                    </p>
                    <button
                      onClick={goToNextPage}
                      disabled={pageNumber >= numPages}
                      className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadBook;
