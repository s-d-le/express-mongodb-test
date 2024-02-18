import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import router from './router';

const app = express();

app.use(cors({
    credentials: true, //auth
}))

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
})

const MONGO_URL = 'mongodb+srv://ayzkeys:VQSq5KEsuGzoEbJm@cluster0.q6ifanc.mongodb.net/?retryWrites=true&w=majority'

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (err: Error) => {
    console.error('MongoDB error', err)
});

//handle all routes
app.use('/', router())