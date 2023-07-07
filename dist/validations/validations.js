"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserFieldsType = exports.validateUserKeys = exports.validUserId = void 0;
const uuid_1 = require("uuid");
const constants_1 = require("../constants");
const validUserId = (id, response) => {
    let isValid = true;
    if (!(0, uuid_1.validate)(id)) {
        isValid = false;
        response.statusCode = constants_1.HTTP_STATUS_CODE.BAD_REQUEST;
        response.end(JSON.stringify({ message: `Invalid user id: ${id}` }));
    }
    return isValid;
};
exports.validUserId = validUserId;
const validateUserKeys = (userData, response) => {
    const validKeys = ['username', 'age', 'hobbies'];
    const areKeysValid = Object.keys(userData).every(key => validKeys.includes(key));
    if (!areKeysValid) {
        response.statusCode = constants_1.HTTP_STATUS_CODE.BAD_REQUEST;
        response.end(JSON.stringify({ message: 'Invalid fields in user!' }));
    }
    return areKeysValid;
};
exports.validateUserKeys = validateUserKeys;
const validateUserFieldsType = (user, response) => {
    const isValid = typeof user.username === 'string' &&
        typeof user.age === 'number' &&
        Array.isArray(user.hobbies) &&
        user.hobbies.every(hobbie => typeof hobbie === 'string');
    if (!isValid) {
        response.statusCode = constants_1.HTTP_STATUS_CODE.BAD_REQUEST;
        response.end(JSON.stringify({ message: 'Invalid fields type in user!' }));
    }
    return isValid;
};
exports.validateUserFieldsType = validateUserFieldsType;
//# sourceMappingURL=validations.js.map