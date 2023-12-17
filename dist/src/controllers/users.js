"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.deleteUser = exports.getAllUsers = void 0;
const helpers_1 = require("../helpers");
const admin = require('firebase-admin');
const getAllUsers = async (req, res) => {
    try {
        const users = await admin.firestore().collection('users').get();
        return res.status(200).json({ users: users.docs.map((user) => user.data()) });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await admin.firestore().collection('users').doc(id).delete();
        return res.status(200).json(deletedUser);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.deleteUser = deleteUser;
const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'missing fields' });
        }
        const { password, newPassword } = req.body;
        if (!password || !newPassword) {
            return res.status(400).json({ message: 'fields mising' });
        }
        if (password == newPassword) {
            return res.status(400).json({ message: 'passwords are the same' });
        }
        const existingUserRef = await admin.firestore().collection('users').doc(id);
        const existingUserDoc = await existingUserRef.get();
        if (!existingUserDoc.exists) {
            return res.status(400).json({ message: 'incorrect id' });
        }
        const existingUser = existingUserDoc.data();
        const hashedPassword = (0, helpers_1.authentication)(process.env.SECRET, password);
        if (existingUser.auth.password !== hashedPassword) {
            return res.status(400).json({ message: 'incorrect password' });
        }
        let psw = (0, helpers_1.authentication)(process.env.SECRET, newPassword);
        let authStuff = existingUser.auth;
        await admin.firestore().collection('users').doc(id).update({ auth: { ...authStuff, password: psw } }, { merge: true });
        return res.status(200).json({ message: 'password updated' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=users.js.map