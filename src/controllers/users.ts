import express from 'express'
const admin = require('firebase-admin');

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await admin.firestore().collection('users').get()
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params

        const deletedUser = await admin.firestore().collection('users').doc(id).delete()
        return res.status(200).json(deletedUser)
    }catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

export const updatePassword = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params

        if (!id) {
            return res.status(400).json({message: 'missing fields'})
        }

        const {password} = req.body

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        await admin.firestore().collection('users').doc(id).set({password},{merge:true})
        return res.status(200).json({message: 'password updated'})
    }catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}