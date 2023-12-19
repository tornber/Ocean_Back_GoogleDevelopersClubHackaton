import express from 'express'
import Grid from 'gridfs-stream'
import fs from 'fs'
import mongoose, { Mongoose } from 'mongoose';
import { random } from '../helpers';
const admin = require('firebase-admin');

// export const uploadFiles = async (req: express.Request, res: express.Response) => {
//         let uploadedFiles : object[] = []
//         const postId = random()
//         if (true) {
//             const conn = mongoose.connection
//             if (!conn) {
//                 console.log(conn)
//                 return res.status(500).json({message: 'error connecting to database'})
//             }
//             let gfs
//             try {
//                 // gfs = Grid(conn.db, mongoose.mongo)
//                 // gfs.collection('uploads')
//                 gfs = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'reports'})
//             } catch(error) {
//                 console.log(error)
//             }
//             for (const key in (req as any).files) {
//                 const fileId = new mongoose.Types.ObjectId()
//                 const uploadedFile = (req as any).files[key]
//                 const tmpFilePath = "./tmp/" + uploadedFile.name
//                 // const writeStream = gfs.createWriteStream({_id:fileId.toHexString(),filename: uploadedFile.name, metadata: {postId,originalFileName: uploadedFile.name}})
//                 const writeStream = gfs.openUploadStreamWithId(fileId,uploadedFile.name,{metadata: {postId,originalFileName: uploadedFile.name}})
//                 // uploadedFile.pipe(writeStream)
//                 // uploadedFile.data.pipe(writeStream)
                

//                 // writeStream.on('close', (file) => {
//                     //     console.log(`File ${uploadedFile.name} uploaded to GridFS with ID: ${file._id}`);
//                 //     uploadedFiles.push({id: file._id.toString(),name: uploadedFile.name})
//                 //     });
//                 // writeStream.on('error', (err) => {
//                     //     console.error(`Error uploading file ${uploadedFile.name} to GridFS:`, err);
//                     // });
                    
//                 console.log(uploadedFile)
//                 fs.writeFileSync(tmpFilePath,uploadedFile.data)
//                 fs.createReadStream(tmpFilePath).pipe(writeStream)
//                 writeStream.on('finish', () => {
//                     console.log(`File ${uploadedFile.name} uploaded to GridFS with ID: ${fileId}`);
//                     uploadedFiles.push({id: fileId.toString(),name: uploadedFile.name})
//                     uploadedFiles.forEach((file : object) => {
//                         console.log(file)
//                     })
//                     fs.unlinkSync(tmpFilePath)
//                 });
//                 writeStream.on('error', (err) => {
//                     console.error(`Error uploading file ${uploadedFile.name} to GridFSBucket:`, err);
//                     fs.unlinkSync(tmpFilePath)
//                 });
//             }
//         }
        
//         return res.status(200).json({message: 'files uploaded',filesUploaded: uploadedFiles})
// }

export const createReport = async (req: express.Request, res: express.Response) => {
    try {
        const {title,description,author,exposedList} = req.body
        const {isFiles} = req.query
        let uploadedFiles : object[] = []

        if(!title || !description || !author || !exposedList) {
            return res.status(400).json({message: 'missing fields'})
        }
        const postId = title + random()
        if (isFiles) {
            const conn = mongoose.connection
            if (!conn) {
                console.log(conn)
                return res.status(500).json({message: 'error connecting to database'})
            }
            let gfs
            try {
                gfs = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'reports'})
            } catch(error) {
                console.log(error)
            }
            for (const key in (req as any).files) {
                const fileId = new mongoose.Types.ObjectId()
                const uploadedFile = (req as any).files[key]
                const tmpFilePath = "./tmp/" + uploadedFile.originalname
                const writeStream = gfs.openUploadStreamWithId(fileId,uploadedFile.originalname,{metadata: {postId,originalFileName: uploadedFile.originalname}})

                fs.writeFileSync(tmpFilePath,uploadedFile.buffer)
                fs.createReadStream(tmpFilePath).pipe(writeStream)
                writeStream.on('finish', () => {
                    console.log(`File ${uploadedFile.originalname} uploaded to GridFS with ID: ${fileId}`);
                    uploadedFiles.push({id: fileId.toString(),name: uploadedFile.originalname})
                    fs.unlinkSync(tmpFilePath)
                });
                writeStream.on('error', (err) => {
                    console.error(`Error uploading file ${uploadedFile.originalname} to GridFSBucket:`, err);
                    fs.unlinkSync(tmpFilePath)
                });
            }
        }
        const reportRef = await admin.firestore().collection('reports').add({...req.body,postId})
        const reportsDoc = await reportRef.get()
        const report = reportsDoc.data()

        return res.status(200).json({message: 'report created',report,uploadedFiles})

    } catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
}