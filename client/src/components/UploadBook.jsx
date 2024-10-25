import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadBook = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [publication, setPublication] = useState('');
    const [publishedDate, setPublishedDate] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [thumbnail, setThumbnail] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('author', author);
        formData.append('publication', publication);
        formData.append('publishedDate', publishedDate);
        formData.append('price', price);
        formData.append('category', category);
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:5000/admin/uploadBooks', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token,
                },
            });
            toast.success(response.data.message);
            setTitle('');
            setDescription('');
            setAuthor('');
            setPublication('');
            setPublishedDate('');
            setPrice('');
            setCategory('');
            setThumbnail(null);
        } catch (err) {
            console.error("Error response:", err.response);
            toast.error(err.response ? err.response.data.error : 'An error occurred.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-indigo-900 mb-2">Upload a Book</h2>
                    <p className="text-indigo-600">Fill in the details below to add a new book to the collection</p>
                </div>
                
                <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2" htmlFor="title">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-md border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-indigo-300 transition duration-150 ease-in-out"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2" htmlFor="author">
                                Author
                            </label>
                            <input
                                type="text"
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-indigo-300 transition duration-150 ease-in-out"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-indigo-700 mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-indigo-300 transition duration-150 ease-in-out"
                            rows="4"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2" htmlFor="publication">
                                Publication
                            </label>
                            <input
                                type="text"
                                id="publication"
                                value={publication}
                                onChange={(e) => setPublication(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-indigo-300 transition duration-150 ease-in-out"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2" htmlFor="publishedDate">
                                Published Date
                            </label>
                            <input
                                type="date"
                                id="publishedDate"
                                value={publishedDate}
                                onChange={(e) => setPublishedDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-indigo-300 transition duration-150 ease-in-out"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2" htmlFor="price">
                                Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-indigo-500">$</span>
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 rounded-md border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-indigo-300 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-indigo-700 mb-2" htmlFor="category">
                                Category
                            </label>
                            <input
                                type="text"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-indigo-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-indigo-300 transition duration-150 ease-in-out"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-indigo-700 mb-2" htmlFor="thumbnail">
                            Thumbnail
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-indigo-200 border-dashed rounded-md hover:border-indigo-500 bg-indigo-50 transition duration-150 ease-in-out">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-indigo-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-indigo-600">
                                    <label htmlFor="thumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload a file</span>
                                        <input
                                            id="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setThumbnail(e.target.files[0])}
                                            required
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-indigo-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            Upload Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadBook;