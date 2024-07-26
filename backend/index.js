import express from 'express';
import { PORT } from './config';
import mongoose from 'mongoose';

const app = express();

app.get('/', (req, res) => {});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose