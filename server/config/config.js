require('dotenv').config(); // Load .env variables

module.exports = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI,
    JWT_SECRET : "kirat_server",
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    }
};
