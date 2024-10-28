import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import pngwing from './pngwing.png';

const PremiumPrompt = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); 

    useEffect(() => {
        if (token) {
            navigate('/purchase-premium');
        }
    }, [token, navigate]);

    const handleLoginPrompt = () => {
        toast.info('Please log in to purchase the premium collection');
        navigate('/signin');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white-to-br from-indigo-50 to-purple-50 p-6">
            <img 
                src={pngwing} 
                alt="Premium Book Collection" 
                className="w-80 h-80 mb-4"  // Adjusted width and height
            />
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                To Read Premium Books, Purchase Our Premium Pack
            </h1>
            <p className="text-indigo-600 text-center mb-8">
                Gain access to a vast collection of exclusive, high-quality books.
            </p>
            {!token && (
                <button
                    onClick={handleLoginPrompt}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
                >
                    Log In to Purchase Collection
                </button>
            )}
        </div>
    );
};

export default PremiumPrompt;
