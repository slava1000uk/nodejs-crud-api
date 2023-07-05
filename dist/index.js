"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const dotenv_1 = require("dotenv");
const node_process_1 = __importDefault(require("node:process"));
const node_crypto_1 = require("node:crypto");
var HTTP_METHOD;
(function (HTTP_METHOD) {
    HTTP_METHOD["GET"] = "GET";
    HTTP_METHOD["POST"] = "POST";
    HTTP_METHOD["PUT"] = "PUT";
    HTTP_METHOD["DELETE"] = "DELETE";
})(HTTP_METHOD || (HTTP_METHOD = {}));
var HTTP_STATUS_CODE;
(function (HTTP_STATUS_CODE) {
    HTTP_STATUS_CODE[HTTP_STATUS_CODE["OK"] = 200] = "OK";
    HTTP_STATUS_CODE[HTTP_STATUS_CODE["CREATED"] = 201] = "CREATED";
    HTTP_STATUS_CODE[HTTP_STATUS_CODE["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTP_STATUS_CODE[HTTP_STATUS_CODE["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTP_STATUS_CODE[HTTP_STATUS_CODE["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HTTP_STATUS_CODE || (HTTP_STATUS_CODE = {}));
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
            case HTTP_METHOD.GET:
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
            case HTTP_METHOD.POST:
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
    response.statusCode = HTTP_STATUS_CODE.OK;
    response.end(JSON.stringify(output));
});
(0, dotenv_1.config)();
const DEFAULT_PORT = 4000;
const PORT = Number(node_process_1.default.env.PORT || DEFAULT_PORT);
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
