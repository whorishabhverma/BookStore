import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// toast.configure();

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Premium Subscription
      </h2>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors duration-200`}
        >
          {isLoading ? "Processing..." : "Subscribe to Premium"}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionForm;
