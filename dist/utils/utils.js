"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFromRequest = exports.hasRequestUrlId = exports.getIdFromRequestURL = void 0;
const constants_1 = require("../constants");
const getIdFromRequestURL = (url) => {
    let id = url.replace(constants_1.URL_BEFORE_ID_REGEXP, '');
    if (id.endsWith('/')) {
        id = id.slice(0, id.length - 1);
    }
    return id;
};
exports.getIdFromRequestURL = getIdFromRequestURL;
const hasRequestUrlId = (url) => {
    if (url && (0, exports.getIdFromRequestURL)(url))
        return true;
    return false;
};
exports.hasRequestUrlId = hasRequestUrlId;
const getDataFromRequest = (request) => {
    return new Promise((resolve, reject) => {
        try {
            let body = '';
            request.on('data', (chunk) => {
                body += chunk.toString();
            });
            request.on('end', () => {
                resolve(body);
            });
            request.on('error', () => {
                reject('Invalid request');
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.getDataFromRequest = getDataFromRequest;
//# sourceMappingURL=utils.js.map