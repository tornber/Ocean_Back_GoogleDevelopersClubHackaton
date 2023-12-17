"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlog = void 0;
const admin = require('firebase-admin');
const createBlog = async (req, res) => {
    try {
        const { name, description, author } = req.body;
        if (!name || !description || !author) {
            return res.status(400).json({ message: 'missing fields' });
        }
        const blog = await admin.firestore().collection('blogs').add({ ...req.body });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.createBlog = createBlog;
//# sourceMappingURL=blogs.js.map