import express from 'express'
import { auth } from 'firebase-admin';
import { random,authentication } from '../helpers';
const admin = require('firebase-admin');

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { name,surname,email,username, password } = req.body;
        if(!name || !surname || !email || !username || !password) {
            return res.status(400).json({message: 'missing fields'})
        }

        const existingUser = await admin.firestore().collection('users').where('email','==',email).get()
        if(!existingUser.empty) {
            return res.status(400).json({message: 'user already exists'})
        }
        const salt = process.env.SECRET
        const user = await admin.firestore().collection('users').add({...req.body,auth: {password:authentication(salt,password),sessionId:random()}})
        return res.status(200).json({message: 'user created',user})

    } catch (error ) {
        console.log(error.message)
        return res.status(500).json(error)
    }
}
export const login = async (req: express.Request, res: express.Response) => {
    const [email,password] = req.body

    if (!email || !password) {
        res.status(400).json({message: 'missing fields'})
    } 
    const user = await admin.firestore().collection('users').where('email','==',email).limit(1).get()
    
    if (user.empty) {
        res.status(400).json({message: 'user with that email not found'})
    }

    const expectedHash = authentication(process.env.SECRET,password)
    
    if (user.password !== expectedHash) {
        res.status(400).json({message: 'incorrect password'})
    }

    const salt = process.env.SECRET
    await admin.firestore().collection('users').doc(user.id).update({...user,auth:{sessionId:random()}})

    res.cookie('sessionId',user.auth.sessionId,{httpOnly:true,secure:true,domain:'localhost',path:'/'})
    return res.status(200).json(user).end()
}

