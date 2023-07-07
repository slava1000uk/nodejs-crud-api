"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const dotenv_1 = require("dotenv");
const node_process_1 = __importDefault(require("node:process"));
const constants_1 = require("./constants");
const action_methods_1 = require("./action-methods/action-methods");
const utils_1 = require("./utils/utils");
const server = (0, node_http_1.createServer)(async (request, response) => {
    const isEndpointUsers = (request.url === '/api/users') || (request.url === '/api/users/');
    response.setHeader("Content-Type", "application/json");
    try {
        switch (request.method) {
            case constants_1.HTTP_METHOD.GET:
                if (isEndpointUsers) {
                    (0, action_methods_1.getAllUsers)(response);
                }
                else if (request.url && (0, utils_1.hasRequestUrlId)(request.url)) {
                    const id = (0, utils_1.getIdFromRequestURL)(request.url);
                    (0, action_methods_1.getOneUser)(id, response);
                }
                else {
                    response.statusCode = constants_1.HTTP_STATUS_CODE.BAD_REQUEST;
                    response.end(JSON.stringify({
                        message: request.url ? "Url doesn't have user id" : "Url is not correct"
                    }));
                }
                break;
            case constants_1.HTTP_METHOD.POST:
                if (isEndpointUsers) {
                    await (0, action_methods_1.createUser)(request, response);
                }
                else {
                    response.statusCode = constants_1.HTTP_STATUS_CODE.BAD_REQUEST;
                    response.end(JSON.stringify({ message: "Url is not correct" }));
                }
                break;
            case constants_1.HTTP_METHOD.PUT:
                if (request.url && (0, utils_1.hasRequestUrlId)(request.url)) {
                    const id = (0, utils_1.getIdFromRequestURL)(request.url);
                    await (0, action_methods_1.updateUser)(id, request, response);
                }
                else {
                    response.statusCode = constants_1.HTTP_STATUS_CODE.BAD_REQUEST;
                    response.end(JSON.stringify({
                        message: request.url ? "Url doesn't have user id" : "Url is not correct"
                    }));
                }
                break;
            case constants_1.HTTP_METHOD.DELETE:
                if (request.url && (0, utils_1.hasRequestUrlId)(request.url)) {
                    const id = (0, utils_1.getIdFromRequestURL)(request.url);
                    await (0, action_methods_1.deleteUser)(id, response);
                }
                else {
                    response.statusCode = constants_1.HTTP_STATUS_CODE.BAD_REQUEST;
                    response.end(JSON.stringify({
                        message: request.url ? "Url doesn't have user id" : "Url is not correct"
                    }));
                }
                break;
        }
    }
    catch (error) {
        console.error("Url is not correct");
    }
});
(0, dotenv_1.config)();
const PORT = Number(node_process_1.default.env.PORT || constants_1.DEFAULT_PORT);
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
//# sourceMappingURL=index.js.map