"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const dotenv_1 = require("dotenv");
const node_process_1 = __importDefault(require("node:process"));
;
;
let users = [];
const getAllUsers = () => users;
const URL_BEFORE_ID_REGEXP = /^\/api\/users\/$/;
const getIdFromURL = (url) => {
    let id = url.replace(URL_BEFORE_ID_REGEXP, '');
    if (id.endsWith('/')) {
        id = id.slice(0, id.length - 1);
    }
    return id;
};
const getUserById = (id) => {
    const userById = users.find(user => user.id === id);
    return userById;
};
const server = (0, node_http_1.createServer)((request, response) => {
    const isUrlEndsWithUsers = (request.url === '/api/users') || (request.url === '/api/users/');
    let output;
    response.setHeader("Content-Type", "application/json");
    // response.statusCode = 200;
    // response.end(JSON.stringify({ data: 'Viacheslav Tyshchuk' }));
    try {
        switch (request.method) {
            case 'GET':
                if (isUrlEndsWithUsers) {
                    output = getAllUsers();
                }
                else {
                    const id = request.url ? getIdFromURL(request.url) : '';
                    if (id) {
                        output = getUserById(id);
                    }
                }
                break;
            default:
                console.error(`${request.method} not working`);
                break;
        }
    }
    catch (error) {
        console.error(error);
    }
    response.statusCode = 200;
    response.end(JSON.stringify(output));
});
(0, dotenv_1.config)();
const DEFAULT_PORT = 4000;
const PORT = Number(node_process_1.default.env.PORT || DEFAULT_PORT);
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
