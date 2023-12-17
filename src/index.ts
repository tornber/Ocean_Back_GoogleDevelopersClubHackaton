import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';    
dotenv.config()
import admin,{ServiceAccount} from 'firebase-admin';
import credentials from '../cert/serviceAccountKey.json'
// import router from './router/index';
import { getAllUsers,deleteUser, updatePassword } from './controllers/users'
import { isAuthenticated,isOwnerOrAdmin } from './middlewares'
import { register,login } from './controllers/authentication';
import { create } from 'lodash';
import { createReport } from './controllers/reports';
const router = express.Router();
const app = express()



app.use(cors({
    credentials: true
}));
app.use(compression());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload())

mongoose.connect(process.env.MONGO_URI as string).then(() => console.log('connected to database')).catch((err) => console.log(err))

router.post('/auth/register',register)
router.post('/auth/login',login)
router.get('/users',isAuthenticated,getAllUsers)
router.delete('/users/:id',isAuthenticated,isOwnerOrAdmin,deleteUser)
router.patch('/users/:id',isAuthenticated,isOwnerOrAdmin,updatePassword)
router.post('/reports',createReport) 
// router.post('/reports',uploadFiles) 
app.use('/',router)
app.get('/', (req, res) => {
    res.send('Hello World!')  
})

const server = http.createServer(app);
const serviceAccountCredentials : ServiceAccount = credentials as ServiceAccount
admin.initializeApp({credential: admin.credential.cert(serviceAccountCredentials)});


server.listen(process.env.PORT || 8080, () => { console.log(`server is running on http://localhost:${process.env.PORT}`) })