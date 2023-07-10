"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getOneUser = exports.getAllUsers = void 0;
const Userdatabase = __importStar(require("../userdatabase/userdatabase"));
const constants_1 = require("../constants");
const validations_1 = require("../validations/validations");
const utils_1 = require("../utils/utils");
const getAllUsers = (response) => {
    try {
        const allUsers = Userdatabase.getAll();
        response.statusCode = constants_1.HTTP_STATUS_CODE.OK;
        response.end(JSON.stringify(allUsers));
    }
    catch (error) {
        console.error(error);
        // Correct Error message later: problem to get all users?
    }
};
exports.getAllUsers = getAllUsers;
const getOneUser = (id, response) => {
    if ((0, validations_1.validUserId)(id, response)) {
        const user = Userdatabase.getUserById(id);
        if (!user) {
            response.statusCode = constants_1.HTTP_STATUS_CODE.NOT_FOUND;
            response.end(JSON.stringify({ message: `User with id: ${id} not found` }));
        }
        else {
            response.statusCode = constants_1.HTTP_STATUS_CODE.OK;
            response.end(JSON.stringify(user));
        }
    }
};
exports.getOneUser = getOneUser;
const createUser = async (request, response) => {
    try {
        const body = await (0, utils_1.getDataFromRequest)(request);
        const userData = JSON.parse(body);
        if ((0, validations_1.validateUserKeys)(userData, response) && (0, validations_1.validateUserFieldsType)(userData, response)) {
            const newUser = Userdatabase.createUserWithId(userData);
            response.statusCode = constants_1.HTTP_STATUS_CODE.CREATED;
            response.end(JSON.stringify(newUser));
        }
    }
    catch (error) {
        console.error(error);
    }
};
exports.createUser = createUser;
const updateUser = async (id, request, response) => {
    if ((0, validations_1.validUserId)(id, response)) {
        const currentUser = Userdatabase.getUserById(id);
        if (!currentUser) {
            response.statusCode = constants_1.HTTP_STATUS_CODE.NOT_FOUND;
            response.end(JSON.stringify({ message: `User with id: ${id} not found` }));
            return;
        }
        try {
            const body = await (0, utils_1.getDataFromRequest)(request);
            const newUserData = JSON.parse(body);
            if ((0, validations_1.validateUserKeys)(newUserData, response) && (0, validations_1.validateUserFieldsType)(newUserData, response)) {
                const userDataToUpdate = {
                    username: newUserData.username || currentUser.username,
                    age: newUserData.age || currentUser.age,
                    hobbies: newUserData.hobbies || currentUser.hobbies
                };
                const updatedUser = Userdatabase.updateUserById(id, userDataToUpdate);
                response.statusCode = constants_1.HTTP_STATUS_CODE.OK;
                response.end(JSON.stringify(updatedUser));
            }
        }
        catch (error) {
            console.error('Problem with updating user');
        }
    }
};
exports.updateUser = updateUser;
const deleteUser = (id, response) => {
    if ((0, validations_1.validUserId)(id, response)) {
        const userToDelete = Userdatabase.getUserById(id);
        if (!userToDelete) {
            response.statusCode = constants_1.HTTP_STATUS_CODE.NOT_FOUND;
            response.end(JSON.stringify({ message: `User with id: ${id} not found` }));
            return;
        }
        try {
            Userdatabase.removeUserById(id);
            response.statusCode = constants_1.HTTP_STATUS_CODE.DELETED;
            response.end(JSON.stringify({ message: `User with id: ${id} has been deleted` }));
        }
        catch (error) {
            response.statusCode = constants_1.HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
            response.end(JSON.stringify({ message: `Problem with deleting user with id: ${id}` }));
            console.error('Problem with deleting user');
        }
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=action-methods.js.map