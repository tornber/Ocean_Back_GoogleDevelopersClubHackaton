"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwnerOrAdmin = exports.isAuthenticated = void 0;
const lodash_1 = require("lodash");
const admin = require('firebase-admin');
const isAuthenticated = async (req, res, next) => {
    try {
        const sessionCookie = req.cookies['sessionId'];
        if (sessionCookie === undefined) {
            return res.sendStatus(401);
        }
        const existingUser = await admin.firestore().collection('users').where('auth.sessionId', '==', sessionCookie).get();
        if (existingUser.empty) {
            return res.sendStatus(401);
        }
        (0, lodash_1.merge)(req, { identity: existingUser });
        next();
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};
exports.isAuthenticated = isAuthenticated;
const isOwnerOrAdmin = async (req, res, next) => {
    try {
        const existingUser = (0, lodash_1.get)(req, 'identity.docs[0].data()') || undefined;
        if (existingUser === undefined) {
            return res.status(401).json({ message: 'unauthorized' });
        }
        if (existingUser.id !== req.params.id) {
            return res.status(401).json({ message: 'unauthorized' });
        }
        if (existingUser.auth.isAdmin === true || existingUser.id === req.params.id) {
            next();
        }
        else {
            return res.sendStatus(403);
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};
exports.isOwnerOrAdmin = isOwnerOrAdmin;
//# sourceMappingURL=index.js.map