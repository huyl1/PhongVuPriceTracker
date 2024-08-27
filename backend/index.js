import express from 'express';
import { PORT } from './config';
import mongoose from 'mongoose';
import productRoute from './routes/productRoute.js';
import priceRoute from './routes/priceRoute.js';
import collectionRoute from './routes/collectionRoute.js';
import suggestionRoute from './routes/suggestionRoute.js';
import searchRoute from './routes/searchRoute.js';
import cors from 'cors';
import "dotenv/config.js";

const app = express();

// Middleware to parse JSON data
app.use(express.json());

app.use(cors());

app.use('/products', productRoute);

app.use('/prices', priceRoute);

app.use('/collections', collectionRoute);

app.use('/suggestions', suggestionRoute);

app.use('/search', searchRoute);

// Connect to MongoDB

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });