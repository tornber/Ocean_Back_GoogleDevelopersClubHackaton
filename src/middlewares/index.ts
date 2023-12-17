import express from 'express';
import {get,merge} from 'lodash'
const admin = require('firebase-admin');

interface User {
    id: string,
    auth: {
        isAdmin: boolean,
    }
}

export const isAuthenticated = async (req : express.Request,res: express.Response,next: express.NextFunction) => {
    try {
        const sessionCookie = req.cookies['sessionId']

        if (sessionCookie === undefined) {
            return res.sendStatus(401).end()
        }

        const existingUserRef = await admin.firestore().collection('users').where('auth.sessionId','==',sessionCookie)
        const existingUserDoc = await existingUserRef.get()
        
        if (existingUserDoc.empty) {
            return res.sendStatus(401).end()
        }
        
        const existingUser =  existingUserDoc.docs[0].data() 
        merge(req,{identity: {...existingUser,id: existingUserDoc.docs[0].id}})
        next()
    } catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
}

export const isOwnerOrAdmin = async (req : express.Request,res: express.Response,next: express.NextFunction) => {
    try {
        const existingUser = get(req,'identity') as User || undefined 

        if (existingUser === undefined) {
            return res.status(401).json({message: 'unauthorized'})  
        }

        if (existingUser.id !== req.params.id) {
            return res.status(401).json({message: 'unauthorized'})
        }

        if (existingUser.auth.isAdmin === true || existingUser.id === req.params.id) {
            next()
        } else {
            return res.sendStatus(403);
        }


    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}
