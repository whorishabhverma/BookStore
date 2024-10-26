import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import { X } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReadBook = ({ pdfUrl, authorizationToken, buttonText = "Read Book" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [inputPageNumber, setInputPageNumber] = useState('');
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen && pdfUrl) {
      fetchPdf();
    }
  }, [isOpen, pdfUrl]);

  // Add resize observer to adjust scale
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current) {
          const containerHeight = containerRef.current.clientHeight - 140; // Account for header and controls
          const containerWidth = containerRef.current.clientWidth - 48; // Account for padding
          
          if (containerRef.current.querySelector('.react-pdf__Page')) {
            const pdfElement = containerRef.current.querySelector('.react-pdf__Page');
            const pdfHeight = pdfElement.scrollHeight;
            const pdfWidth = pdfElement.scrollWidth;
            
            const scaleHeight = containerHeight / pdfHeight;
            const scaleWidth = containerWidth / pdfWidth;
            const newScale = Math.min(scaleHeight, scaleWidth);
            setScale(newScale);
          }
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const fetchPdf = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const headers = {};
      if (authorizationToken) {
        headers['Authorization'] = `Bearer ${authorizationToken}`;
      }

      const response = await fetch(pdfUrl, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      if (blob.type !== 'application/pdf') {
        throw new Error('The provided URL does not point to a valid PDF file');
      }

      setPdfBlob(blob);
    } catch (err) {
      setError(`Failed to load PDF: ${err.message}`);
      console.error('PDF fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openBook = () => {
    if (!pdfUrl) {
      setError('No PDF URL provided');
      return;
    }
    setIsOpen(true);
    setError(null);
  };

  const closeBook = () => {
    setIsOpen(false);
    setPageNumber(1);
    setError(null);
    setPdfBlob(null);
    setInputPageNumber('');
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

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputPageNumber(value);
    }
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const newPage = parseInt(inputPageNumber, 10);
    if (newPage && newPage > 0 && newPage <= numPages) {
      setPageNumber(newPage);
      setInputPageNumber('');
    } else {
      setError(`Please enter a valid page number between 1 and ${numPages}`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={openBook}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-blue-400"
        disabled={!pdfUrl}
      >
        {buttonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center p-4 z-50">
          <div 
            ref={containerRef} 
            className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col"
            style={{ width: '800px', height: '85vh' }}
          >
            <div className="absolute top-2 right-2 z-50">
              <button
                onClick={closeBook}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                aria-label="Close PDF viewer"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-xl font-semibold mb-4">PDF Viewer</h2>

            {error ? (
              <div className="text-red-600 p-4 bg-red-50 rounded-lg mb-4">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            ) : isLoading ? (
              <LoadingSpinner />
            ) : pdfBlob ? (
              <div className="flex-1 flex flex-col items-center min-h-0">
                <div className="flex-1 flex items-center justify-center w-full">
                  <Document
                    file={pdfBlob}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<LoadingSpinner />}
                  >
                    <Page 
                      pageNumber={pageNumber}
                      scale={scale}
                      className="shadow-lg"
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      loading={<LoadingSpinner />}
                    />
                  </Document>
                </div>

                {numPages && (
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition disabled:bg-gray-200 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <p className="text-gray-700">
                        Page {pageNumber} of {numPages}
                      </p>
                      <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition disabled:bg-gray-200 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    
                    <form onSubmit={handlePageSubmit} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputPageNumber}
                        onChange={handlePageInputChange}
                        placeholder="Page"
                        className="w-16 px-2 py-1 bg-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Go to page"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Go
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-600 p-4 text-center">
                Loading PDF viewer...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadBook;