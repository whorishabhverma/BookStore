import React, { useState } from "react";
import { toast } from "react-toastify";
import { User, Star, CreditCard, Lock } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const SubscriptionForm = ({ onSubscribe }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!username) {
      toast.error("Username is required!");
      return;
    }

    setIsLoading(true);

    try {
      // Check if the user exists
      const checkResponse = await fetch(
        `http://localhost:5000/user/check/${username}`
      );
      const checkData = await checkResponse.json();

      if (!checkData.exists) {
        toast.error("User does not exist. Please check the username.");
        setIsLoading(false);
        return;
      }

      // Make user premium
      const subscribeResponse = await fetch(
        "http://localhost:5000/user/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      const subscribeData = await subscribeResponse.json();

      if (subscribeResponse.ok) {
        if (subscribeData.message.includes("already a premium member")) {
          toast.info("User is already a premium member!");
        } else {
          toast.success("Successfully subscribed to premium!");
          onSubscribe?.(username);
        }
      } else {
        toast.error(subscribeData.message || "Failed to activate subscription");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl max-w-screen-2xl mx-auto p-9 bg-white rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <Star className="mx-auto text-yellow-500 mb-4" size={48} />
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          Unlock Premium
        </h2>
        <p className="text-gray-600 text-sm">
          Elevate your experience with exclusive features
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-transparent transition duration-300 
              bg-white text-gray-800 placeholder-gray-500"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3 border border-blue-100">
          <Lock className="text-blue-500" size={24} />
          <p className="text-sm text-blue-800">
            Your subscription will be securely processed
          </p>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-bold 
            flex items-center justify-center space-x-2 
            transition duration-300 ease-in-out transform hover:scale-105
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }`}
        >
          <CreditCard size={20} />
          <span>{isLoading ? "Processing..." : "Subscribe to Premium"}</span>
        </button>

        <div className="text-center text-xs text-gray-500 mt-4">
          By subscribing, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;