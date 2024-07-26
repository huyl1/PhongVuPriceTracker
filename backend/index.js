import express from 'express';
import { PORT } from './config';
import mongoose from 'mongoose';
import fs from 'fs';

const app = express();

// Connect to MongoDB
const loginData = fs.readFileSync('./login.json', 'utf8');
const login = JSON.parse(loginData);
const mongodbstring = login.mongodbstring;

// Connect to MongoDB using the mongodbstring
mongoose
    .connect(mongodbstring)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });