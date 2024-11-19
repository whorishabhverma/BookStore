require('dotenv').config(); // Load .env variables

module.exports = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI,
    JWT_SECRET : "kirat_server",
    EMAIL_USER : process.env.EMAIL_USER,
    EMAIL_PASS : process.env.EMAIL_PASS,
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    },
};
