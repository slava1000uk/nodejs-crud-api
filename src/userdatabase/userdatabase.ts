import { UserNoId, UserWithId, UsersDatabaseT } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import process from "node:process";

let users: UserWithId[] = [];

process.on('message', (message: UserWithId[]) => { users = message; });

export const getAll = async (): Promise<UsersDatabaseT> => {
  return new Promise((resolve) => {
    process.send?.(users);
    resolve(users);
  })
};

export const getUserById = async (id: string): Promise<UserWithId | undefined> => {
  return new Promise((resolve) => {
    const userById = users.find(user => user.id === id);

    process.send?.(users);
    resolve(userById);
  })

};

export const createUserWithId = async (user: UserNoId): Promise<UserWithId> => {
  return new Promise((resolve) => {
    const userWithId = { ...user, id: uuidv4() };

    users.push(userWithId);
    process.send?.(users);

    resolve(userWithId);
  })
};

export const updateUserById = async (id: string, userData: UserNoId): Promise<UserWithId | undefined> => {
  return new Promise((resolve) => {
    const indexToUpdateUser = users.findIndex(user => id === user.id);

    users[indexToUpdateUser] = { ...users[indexToUpdateUser], ...userData };

    process.send?.(users);

    resolve(users[indexToUpdateUser]);
  })
};

export const removeUserById = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    const indexToDeleteUser = users.findIndex(user => id === user.id);

    users.splice(indexToDeleteUser, 1);

    process.send?.(users);
    resolve();
    
  })
};