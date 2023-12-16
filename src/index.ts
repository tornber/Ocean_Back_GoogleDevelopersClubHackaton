import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()
import admin,{ServiceAccount} from 'firebase-admin';
import credentials from '../cert/serviceAccountKey.json'
import router from './router/index';

const app = express()

app.use(cors({
    credentials: true
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/',router)

const server = http.createServer(app);
const serviceAccountCredentials : ServiceAccount = credentials as ServiceAccount
admin.initializeApp({credential: admin.credential.cert(serviceAccountCredentials)});


// app.get('/', (req, res) => {
//     res.send('Hello World!').end()
// })

server.listen(process.env.PORT, () => { console.log(`server is running on http://localhost:${process.env.PORT}`) })