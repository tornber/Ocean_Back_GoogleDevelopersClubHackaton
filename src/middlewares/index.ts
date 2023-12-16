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
            return res.sendStatus(401)
        }

        const existingUser = await admin.firestore().collection('users').where('auth.sessionId','==',sessionCookie).get()   

        if (existingUser.empty) {
            return res.sendStatus(401)
        }

        merge(req,{identity: existingUser})
        next()
    } catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
}

export const isOwnerOrAdmin = async (req : express.Request,res: express.Response,next: express.NextFunction) => {
    try {
        const existingUser = get(req,'identity.docs[0].data()') as User || undefined 

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

        next()

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}
