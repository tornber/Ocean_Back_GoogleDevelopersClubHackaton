import express from 'express'
const admin = require('firebase-admin');

export const createBlog = async (req: express.Request, res: express.Response) => {
    try {
        const {name,description,author} = req.body
        if(!name || !description || !author) {
            return res.status(400).json({message: 'missing fields'})
        }
        const blog = await admin.firestore().collection('blogs').add({...req.body})
    } catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
}