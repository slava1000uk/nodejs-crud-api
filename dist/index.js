"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const dotenv_1 = require("dotenv");
const node_process_1 = __importDefault(require("node:process"));
const node_crypto_1 = require("node:crypto");
const constants_1 = require("./constants");
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
const getDataFromPost = (request) => {
    let body = '';
    let result = {};
    request.on('data', (chunk) => {
        body += chunk;
    });
    request.on('end', () => {
        result = JSON.parse(body);
    });
    return result;
};
const validateDataFromPost = (body) => {
    const { username, age, hobbies } = body;
    return (typeof username === 'string' &&
        typeof age === 'number' &&
        Array.isArray(hobbies) &&
        hobbies.every(hobbie => typeof hobbie === 'string'));
};
const createUser = (request, response) => {
    const body = getDataFromPost(request); // 1 get data from request
    if (validateDataFromPost(body)) { // 2 validate data
        const { username, age, hobbies } = body;
        //create id and make user with id
        const user = { ...body, id: (0, node_crypto_1.randomUUID)() };
        users.push(user);
    }
    return;
};
const server = (0, node_http_1.createServer)((request, response) => {
    const isEndpointAllUsers = (request.url === '/api/users') || (request.url === '/api/users/');
    let output;
    response.setHeader("Content-Type", "application/json");
    // response.statusCode = 200;
    // response.end(JSON.stringify({ data: 'Viacheslav Tyshchuk' }));
    try {
        switch (request.method) {
            case constants_1.HTTP_METHOD.GET:
                if (isEndpointAllUsers) {
                    output = getAllUsers();
                }
                else {
                    const id = request.url ? getIdFromURL(request.url) : '';
                    if (id) {
                        output = getUserById(id);
                    }
                }
                break;
            case constants_1.HTTP_METHOD.POST:
                if (isEndpointAllUsers) {
                    createUser(request, response);
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
    response.statusCode = constants_1.HTTP_STATUS_CODE.OK;
    response.end(JSON.stringify(output));
});
(0, dotenv_1.config)();
const PORT = Number(node_process_1.default.env.PORT || constants_1.DEFAULT_PORT);
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
