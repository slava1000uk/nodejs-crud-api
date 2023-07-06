import { UserNoId, UserWithId } from "../types/types";
import { randomUUID } from "node:crypto";

let users: UserWithId[] = [];

export const getAll = () => users;

export const getUserById = (id: string) => {
  const userById = users.find(user => user.id === id);
  return userById;
};

export const createUserWithId = (user:UserNoId) => {
  const userWithId = { ...user, id: randomUUID() };

  users.push(userWithId);

  return userWithId;
};

export const updateUserById = (id:string, userData: UserNoId) => {
  const indexToUpdateUser = users.findIndex(user => id === user.id);

  users[indexToUpdateUser] = { ...users[indexToUpdateUser], ...userData };

};

export const removeUserById = (id: string) => {
  const indexToDeleteUser = users.findIndex(user => id === user.id);

  users.splice(indexToDeleteUser, 1);
};