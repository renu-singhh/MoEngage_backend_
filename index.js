const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRouter = require('./routes/userRoutes');
const { connectDB, disconnectDB } = require('./db/mongodb');

dotenv.config();
const port = process.env.PORT || 5500;
const mongoURI = process.env.MONGO_URI;
const live = process.env.LIVE || 'http://localhost:';

const app = express();
app.use(cors());
app.use(express.json());

// Serve the root
app.get('/', (req, res) => {
    res.status(200).send('Hello');
});

// Use user routes
app.use('/user/auth', authRouter);

const start = async () => {
    try {
        if (!mongoURI) {
            console.error('MONGO_URI environment variable is not set.');
            process.exit(1);
        }
        await connectDB(mongoURI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
            console.log(`Go Live: ${live}${port}/`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
};

start();

process.on('SIGINT', () => {
    console.log('Shutting down gracefully');
    disconnectDB();
    process.exit(0);
});
