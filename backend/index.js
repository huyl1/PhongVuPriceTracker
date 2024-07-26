import express from 'express';
import { PORT } from './config';
import mongoose from 'mongoose';
import fs from 'fs';

const app = express();

app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).send('Hello World');
});

// Connect to MongoDB
const loginData = fs.readFileSync('./login.json', 'utf8');
const login = JSON.parse(loginData);
const mongodbstring = login.mongodbstring;

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