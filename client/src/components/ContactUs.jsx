import React from 'react';
import { Mail, Instagram, Twitter } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-6">
          We’d love to hear from you! Reach out to us on any of the platforms below.
        </p>
        <div className="space-y-4">
          {/* Gmail */}
          <a
            href="mailto:example@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            <Mail size={20} />
            <span>Email Us</span>
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/your_instagram_handle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            <Instagram size={20} />
            <span>Follow on Instagram</span>
          </a>
          {/* Twitter */}
          <a
            href="https://twitter.com/your_twitter_handle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            <Twitter size={20} />
            <span>Follow on Twitter</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
