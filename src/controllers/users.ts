import express from 'express'
import { authentication } from '../helpers';
const admin = require('firebase-admin');

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await admin.firestore().collection('users').get()

        return res.status(200).json({users:users.docs.map((user: any) => user.data())})
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

        const {password,newPassword} = req.body

        if (!password|| !newPassword) {
            return res.status(400).json({ message: 'fields mising' });
        }

        if (password == newPassword) {
            return res.status(400).json({ message: 'passwords are the same' });
        }

        const existingUserRef = await admin.firestore().collection('users').doc(id) 
        const existingUserDoc = await existingUserRef.get()        
        if (!existingUserDoc.exists) {
            return res.status(400).json({message: 'incorrect id'})
        }

        const existingUser = existingUserDoc.data()

        const hashedPassword = authentication(process.env.SECRET,password)

        if (existingUser.auth.password !== hashedPassword) {
            return res.status(400).json({message: 'incorrect password'})
        }

        let psw =authentication(process.env.SECRET,newPassword)
        let authStuff = existingUser.auth
        await admin.firestore().collection('users').doc(id).update({auth:{...authStuff,password: psw}},{merge:true})
        return res.status(200).json({message: 'password updated'})
    }catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}