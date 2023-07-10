"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserById = exports.updateUserById = exports.createUserWithId = exports.getUserById = exports.getAll = void 0;
const uuid_1 = require("uuid");
let users = [];
const getAll = () => users;
exports.getAll = getAll;
const getUserById = (id) => {
    const userById = users.find(user => user.id === id);
    return userById;
};
exports.getUserById = getUserById;
const createUserWithId = (user) => {
    const userWithId = { ...user, id: (0, uuid_1.v4)() };
    users.push(userWithId);
    return userWithId;
};
exports.createUserWithId = createUserWithId;
const updateUserById = (id, userData) => {
    const indexToUpdateUser = users.findIndex(user => id === user.id);
    users[indexToUpdateUser] = { ...users[indexToUpdateUser], ...userData };
    return users[indexToUpdateUser];
};
exports.updateUserById = updateUserById;
const removeUserById = (id) => {
    const indexToDeleteUser = users.findIndex(user => id === user.id);
    users.splice(indexToDeleteUser, 1);
};
exports.removeUserById = removeUserById;
//# sourceMappingURL=userdatabase.js.map