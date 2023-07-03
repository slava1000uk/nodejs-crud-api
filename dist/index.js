"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const server = node_http_1.default.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ data: 'Viacheslav Tyshchuk' }));
});
const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
