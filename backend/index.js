import express from 'express';
import { PORT } from './config';
import mongoose from 'mongoose';
import fs from 'fs';
import Product from './models/productModel.js';
import Price from './models/priceModel.js';
import productRoute from './routes/productRoute.js';
import priceRoute from './routes/priceRoute.js';
import cors from 'cors';
import "dotenv/config.js";

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// // Middleware to enable CORS
// app.use(
//     cors({
//         origin: 'http://localhost:3000',
//         credentials: true,
//         allowedHeaders: ['Content-Type'],
//     }));

app.use(cors());

app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).send('Hello World');
});

app.use('/products', productRoute);

app.use('/prices', priceRoute);

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