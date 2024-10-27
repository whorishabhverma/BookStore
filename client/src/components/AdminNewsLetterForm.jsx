import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminNewsLetterForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading spinner

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      const response = await fetch('http://localhost:5000/admin/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, message }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Newsletter sent successfully!');
        setTitle('');
        setMessage('');
      } else {
        toast.error(result.message || 'Failed to send newsletter.');
      }
    } catch (error) {
      toast.error('Error sending newsletter. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="admin-newsletter-form p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="text-red-600 text-2xl font-semibold mb-4">Send Newsletter</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white input input-bordered w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white textarea textarea-bordered w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="btn bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
        {loading && (
          <div className="mt-4 text-center">
            <span className="spinner-border text-blue-500"></span> {/* Loading spinner */}
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminNewsLetterForm;
