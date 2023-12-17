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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccountKey_json_1 = __importDefault(require("../cert/serviceAccountKey.json"));
const index_1 = __importDefault(require("./router/index"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true
}));
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use('/', index_1.default);
const server = http_1.default.createServer(app);
const serviceAccountCredentials = serviceAccountKey_json_1.default;
firebase_admin_1.default.initializeApp({ credential: firebase_admin_1.default.credential.cert(serviceAccountCredentials) });
server.listen(process.env.PORT, () => { console.log(`server is running on http://localhost:${process.env.PORT}`); });
//# sourceMappingURL=index.js.map