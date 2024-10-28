import React from 'react';
import { BookOpen, Coffee, Calendar, Users, BookMarked, LibraryBig } from 'lucide-react';
import pngwing1 from './pngwing1.png';
const AboutUs = () => {
  const features = [
    {
      icon: <BookMarked className="w-6 h-6" />,
      title: "Curated Selection",
      description: "Hand-picked collection of classic and contemporary books"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Book Club Events",
      description: "Regular meetings and author discussions"
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Reading Café",
      description: "Cozy space to enjoy books with coffee and snacks"
    }
  ];

  return (
    
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -top-8 -left-8 w-64 h-64  rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-8 -right-8 w-64 h-64  rounded-full blur-3xl opacity-60" />
          
          {/* Content Container */}
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              {/* Image Section */}
              <div className="w-full md:w-1/2 relative group">
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                <img
                  src={pngwing1}
                  alt="Inside our bookstore"
                  className="w-full h-[500px] object-cover"
                />
                {/* Image Overlay */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <LibraryBig className="w-5 h-5 text-amber-700" />
                    <span className="text-sm font-medium">Since 1995</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 p-8 md:p-12">
                <div className="inline-block px-4 py-2 bg-amber-50 rounded-full text-amber-800 font-medium text-sm mb-6">
                  Your Literary Haven
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Where Stories Come 
                  <span className="text-amber-800"> To Life</span>
                </h1>
                
                <div className="space-y-4 text-gray-600 mb-8">
                  <p className="leading-relaxed">
                    Welcome to <span className="font-semibold text-gray-900">Pages & Chapters</span>, 
                    your neighborhood bookstore where every shelf holds a new adventure. 
                    For over two decades, we've been more than just a bookstore - 
                    we're a community hub for book lovers and storytellers.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="group">
                      <div className="flex flex-col items-center text-center p-4 rounded-xl bg-amber-50/50 hover:bg-amber-100/50 transition-colors duration-300">
                        <div className="p-3 bg-amber-100 rounded-lg text-amber-800 group-hover:bg-amber-800 group-hover:text-white transition-colors duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="mt-4 font-semibold text-gray-900">{feature.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>


                {/* CTA Button */}
                
              </div>
            </div>
          </div>
        </div>
     
  );
};

export default AboutUs;