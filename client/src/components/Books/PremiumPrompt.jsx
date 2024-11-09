import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import pngwing from './pngwing.png';
import { BookOpen, Coffee, BookMarked } from 'lucide-react';

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
        <div className="min-h-screen bg-gradient-to-br  p-6">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 min-h-[80vh]">
                    {/* Content Section - Left */}
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-2 bg-amber-100 rounded-full text-amber-800 font-medium text-sm mb-2">
                                Premium Collection
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                Unlock Our Premium
                                <span className="text-amber-800"> Book Collection</span>
                            </h1>
                            
                            <p className="text-xl text-amber-800 max-w-xl">
                                Gain access to a vast collection of exclusive, carefully curated books.
                            </p>

                            {!token && (
                                <button
                                    onClick={handleLoginPrompt}
                                    className="px-8 py-4 bg-amber-800 text-white font-bold rounded-lg hover:bg-amber-900 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Log In to Purchase Collection
                                </button>
                            )}
                            
                            {/* Premium Features */}
                            <div className="mt-12 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Exclusive Titles</h3>
                                        <p className="text-gray-600">Access to rare and premium books not available in regular collection</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                                        <Coffee className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Early Access</h3>
                                        <p className="text-gray-600">Be the first to read new releases and special editions</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                                        <BookMarked className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Unlimited Reading</h3>
                                        <p className="text-gray-600">Read as many premium books as you want, anytime</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Section - Right */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end px-2">
                        <div className="relative">
                            {/* Decorative background elements */}
                            <div className="absolute -top-8 -right-8 w-64 h-64  rounded-full blur-3xl opacity-60" />
                            <div className="absolute -bottom-8 -left-8 w-64 h-64  rounded-full blur-3xl opacity-60" />
                            
                            {/* Main image with container  */}
                            <div className="relative rounded-2xl p-6 backdrop-blur-sm pb-1">
                                <img 
                                    src={pngwing}
                                    alt="Premium Book Collection"
                                    className="relative w-96 h-96 object-contain transform hover:scale-105 transition duration-300 ease-in-out"
                                />
                            </div>
                           

                           




                            
                            {/* Premium badge */}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <BookMarked className="w-5 h-5 text-amber-700" />
                                    <span className="font-medium text-amber-800">Premium Access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumPrompt;