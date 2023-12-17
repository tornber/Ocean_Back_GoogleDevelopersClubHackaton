import express from 'express'
import Grid from 'gridfs-stream'
import mongoose from 'mongoose';
import { random } from '../helpers';
const admin = require('firebase-admin');

// export const uploadFiles = async (req: express.Request, res: express.Response) => {
//     let uploadedFiles : Array<object> = []
//         const postId = random()
//         if (true) {
//             const conn = mongoose.connection
//             if (!conn) {
//                 console.log(conn)
//                 return res.status(500).json({message: 'error connecting to database'})
//             }
//             let gfs
//             try {
//                 gfs = Grid(conn.db, mongoose.mongo)
//             } catch(error) {
//                 console.log(error)
//             }
//             for (const key in (req as any).files) {
//                 const fileId = new mongoose.Types.ObjectId()
//                 const uploadedFile = (req as any).files[key]
//                 const writeStream = gfs.createWriteStream({_id:fileId.toHexString(),filename: uploadedFile.name, metadata: {postId,originalFileName: uploadedFile.name}})
//                 uploadedFile.data.pipe(writeStream)

//                 writeStream.on('close', (file) => {
//                     console.log(`File ${uploadedFile.name} uploaded to GridFS with ID: ${file._id}`);
//                     uploadedFiles.push({id: file._id.toString(),name: uploadedFile.name})
//                     });
//                 writeStream.on('error', (err) => {
//                     console.error(`Error uploading file ${uploadedFile.name} to GridFS:`, err);
//                 });
//             }
//         }
//         return res.status(200).json({message: 'files uploaded',uploadedFiles})
// }

export const createReport = async (req: express.Request, res: express.Response) => {
    try {
        const {title,description,author,exposedList} = req.body
        // const {userId} = req.params 
        // const {isFiles} = req.query

        if(!title || !description || !author || !exposedList) {
            return res.status(400).json({message: 'missing fields'})
        }
        const postId = title + random()
        if (false) {
            const conn = mongoose.connection
            if (!conn) {
                console.log(conn)
                return res.status(500).json({message: 'error connecting to database'})
            }
            conn.once('open', () => {
                const gfs = Grid(conn.db,mongoose.mongo)
                for (const key in (req as any).files) {
                    const uploadedFile = (req as any).files[key]
                    const writeStream = gfs.createWriteStream({metadata: {postId,originalFileName: uploadedFile.name}})
                    uploadedFile.data.pipe(writeStream)

                    writeStream.on('close', (file) => {
                        console.log(`File ${uploadedFile.name} uploaded to GridFS with ID: ${file._id}`);
                        uploadedFiles.push({id: file._id.toString(),name: uploadedFile.name})
                      });
                    writeStream.on('error', (err) => {
                        console.error(`Error uploading file ${uploadedFile.name} to GridFS:`, err);
                    });
                }
            })
        }
        const reportRef = await admin.firestore().collection('reports').add({...req.body,postId})
        const reportsDoc = await reportRef.get()
        const report = reportsDoc.data()

        let uploadedFiles : Array<object> = []

        return res.status(200).json({message: 'report created',report,uploadedFiles})

    } catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// export const getReports = async (req: express.Request, res: express.Response) => {
//     try {
//         // const {title,description,author,exposedList} = req.body
//         // const {userId} = req.params

//         // if(!title || !description || !author || !exposedList) {
//         //     return res.status(400).json({message: 'missing fields'})
//         // }
//         const reportRef = await admin.firestore().collection('reports')
//         const reportsDoc = await reportRef.get()
//         const reports = reportsDoc.docs.map((doc:any) => doc.data())

//         // let uploadedFiles : Array<object> = []

//         const conn = getConnection()
        
//         // conn.once('open', () => {
//         //     const gfs = Grid(conn.db,mongoose.mongo)
//         //     for (const key in (req as any).files) {
//         //         const uploadedFile = (req as any).files[key]
//         //         const writeStream = gfs.createWriteStream({metadata: {userId,originalFileName: uploadedFile.name}})
//         //         uploadedFile.data.pipe(writeStream)

//         //         writeStream.on('close', (file) => {
//         //             console.log(`File ${uploadedFile.name} uploaded to GridFS with ID: ${file._id}`);
//         //             uploadedFiles.push({id: file._id.toString(),name: uploadedFile.name})
//         //             });
//         //         writeStream.on('error', (err) => {
//         //             console.error(`Error uploading file ${uploadedFile.name} to GridFS:`, err);
//         //         });
//         //     }
//         // })


//         // return res.status(200).json({message: 'report created',report,uploadedFiles})

//     } catch(error) {
//         console.log(error)
//         return res.status(500).json(error)
//     }
// }