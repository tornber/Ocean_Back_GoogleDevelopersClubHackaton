"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccountKey_json_1 = __importDefault(require("../cert/serviceAccountKey.json"));
// import router from './router/index';
const users_1 = require("./controllers/users");
const middlewares_1 = require("./middlewares");
const authentication_1 = require("./controllers/authentication");
const reports_1 = require("./controllers/reports");
const router = express_1.default.Router();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true
}));
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)());
mongoose_1.default.connect(process.env.MONGO_URI).then(() => console.log('connected to database')).catch((err) => console.log(err));
router.post('/auth/register', authentication_1.register);
router.post('/auth/login', authentication_1.login);
router.get('/users', middlewares_1.isAuthenticated, users_1.getAllUsers);
router.delete('/users/:id', middlewares_1.isAuthenticated, middlewares_1.isOwnerOrAdmin, users_1.deleteUser);
router.patch('/users/:id', middlewares_1.isAuthenticated, middlewares_1.isOwnerOrAdmin, users_1.updatePassword);
// router.post('/reports',createReport) 
router.post('/reports', reports_1.uploadFiles);
app.use('/', router);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
const server = http_1.default.createServer(app);
const serviceAccountCredentials = serviceAccountKey_json_1.default;
firebase_admin_1.default.initializeApp({ credential: firebase_admin_1.default.credential.cert(serviceAccountCredentials) });
server.listen(process.env.PORT || 8080, () => { console.log(`server is running on http://localhost:${process.env.PORT}`); });
//# sourceMappingURL=index.js.map