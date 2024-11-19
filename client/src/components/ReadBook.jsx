import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import { X } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// BookLoader component remains the same
const BookLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"></div>
        
        {/* Inner spinning ring */}
        <div className="absolute inset-2 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        
        {/* Book icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <div className="text-lg font-medium text-gray-700">Loading your book</div>
        <div className="text-sm text-gray-500">Please wait while we prepare your reading experience</div>
      </div>
    </div>
  );
};

const ReadBook = ({ pdfUrl, authorizationToken, buttonText = "Read Book" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [inputPageNumber, setInputPageNumber] = useState('');
  const [scale, setScale] = useState(1);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    if (isOpen && pdfUrl) {
      fetchPdf();
    }
  }, [isOpen, pdfUrl]);

  // Enhanced scale calculation
  const calculateScale = () => {
    if (!containerRef.current || !pageSize.width || !pageSize.height) return;

    const containerHeight = containerRef.current.clientHeight - 140; // Account for header and controls
    const containerWidth = containerRef.current.clientWidth - 48; // Account for padding

    if (pageSize.width && pageSize.height) {
      const scaleWidth = containerWidth / pageSize.width;
      const scaleHeight = containerHeight / pageSize.height;
      const newScale = Math.min(scaleWidth, scaleHeight, 1.5); // Cap maximum scale at 1.5
      setScale(newScale);
    }
  };

  // Handle page load success and get initial page dimensions
  const handlePageLoadSuccess = (page) => {
    const { width, height } = page.getViewport({ scale: 1 });
    setPageSize({ width, height });
  };

  // Update scale when container size or page size changes
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        calculateScale();
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [pageSize]);

  // Recalculate scale when page size changes
  useEffect(() => {
    calculateScale();
  }, [pageSize]);

  const fetchPdf = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const headers = {};
      if (authorizationToken) {
        headers['Authorization'] = `${authorizationToken}`;
      }

      const response = await fetch(pdfUrl,{ mode: 'cors' });

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

  // Rest of the helper functions remain the same
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
    setPageSize({ width: 0, height: 0 });
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

  // Navigation functions remain the same
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
            className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col overflow-hidden"
            style={{ width: '800px', height: '85vh', maxHeight: '85vh' }}
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
              <BookLoader />
            ) : pdfBlob ? (
              <div className="flex-1 flex flex-col items-center min-h-0 overflow-hidden">
                <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                  <Document
                    file={pdfBlob}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<BookLoader />}
                  >
                    <Page 
                      ref={pageRef}
                      pageNumber={pageNumber}
                      scale={scale}
                      className="shadow-lg"
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      loading={<BookLoader />}
                      onLoadSuccess={handlePageLoadSuccess}
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