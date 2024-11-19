const express = require('express');
const cors = require('cors'); // Import cors
const bodyParser = require('body-parser');
const { port } = require("./config/config");

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your frontend's URL and port
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(bodyParser.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
