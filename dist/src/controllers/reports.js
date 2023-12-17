"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReport = exports.uploadFiles = void 0;
const gridfs_stream_1 = __importDefault(require("gridfs-stream"));
const mongoose_1 = __importDefault(require("mongoose"));
const helpers_1 = require("../helpers");
const admin = require('firebase-admin');
const uploadFiles = async (req, res) => {
    let uploadedFiles = [];
    const postId = (0, helpers_1.random)();
    if (true) {
        const conn = mongoose_1.default.connection;
        if (!conn) {
            console.log(conn);
            return res.status(500).json({ message: 'error connecting to database' });
        }
        const gfs = (0, gridfs_stream_1.default)(conn.db, mongoose_1.default.mongo);
        for (const key in req.files) {
            const uploadedFile = req.files[key];
            const writeStream = gfs.createWriteStream({ metadata: { postId, originalFileName: uploadedFile.name } });
            uploadedFile.data.pipe(writeStream);
            writeStream.on('close', (file) => {
                console.log(`File ${uploadedFile.name} uploaded to GridFS with ID: ${file._id}`);
                uploadedFiles.push({ id: file._id.toString(), name: uploadedFile.name });
            });
            writeStream.on('error', (err) => {
                console.error(`Error uploading file ${uploadedFile.name} to GridFS:`, err);
            });
        }
    }
    return res.status(200).json({ message: 'files uploaded', uploadedFiles });
};
exports.uploadFiles = uploadFiles;
const createReport = async (req, res) => {
    try {
        const { title, description, author, exposedList } = req.body;
        // const {userId} = req.params 
        const { isFiles } = req.query;
        if (!title || !description || !author || !exposedList) {
            return res.status(400).json({ message: 'missing fields' });
        }
        const postId = title + (0, helpers_1.random)();
        if (isFiles) {
            const conn = mongoose_1.default.connection;
            if (!conn) {
                console.log(conn);
                return res.status(500).json({ message: 'error connecting to database' });
            }
            conn.once('open', () => {
                const gfs = (0, gridfs_stream_1.default)(conn.db, mongoose_1.default.mongo);
                for (const key in req.files) {
                    const uploadedFile = req.files[key];
                    const writeStream = gfs.createWriteStream({ metadata: { postId, originalFileName: uploadedFile.name } });
                    uploadedFile.data.pipe(writeStream);
                    writeStream.on('close', (file) => {
                        console.log(`File ${uploadedFile.name} uploaded to GridFS with ID: ${file._id}`);
                        uploadedFiles.push({ id: file._id.toString(), name: uploadedFile.name });
                    });
                    writeStream.on('error', (err) => {
                        console.error(`Error uploading file ${uploadedFile.name} to GridFS:`, err);
                    });
                }
            });
        }
        const reportRef = await admin.firestore().collection('reports').add({ ...req.body, postId });
        const reportsDoc = await reportRef.get();
        const report = reportsDoc.data();
        let uploadedFiles = [];
        return res.status(200).json({ message: 'report created', report, uploadedFiles });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.createReport = createReport;
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
//# sourceMappingURL=reports.js.map