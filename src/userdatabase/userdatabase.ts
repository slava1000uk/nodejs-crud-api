import { UserNoId, UserWithId } from "./types/types";

let users: UserWithId[] = [];

export const getAllUsers = () => users;

export const getUserById = (id: string) => {
  // validate id here or above? else throw error invalid id
  const userById = users.find(user => user.id === id);
  return userById;
};

export const createUserWithId = (user:UserNoId) => {
  const userWithId = { ...user, id: randomUUID() };

  users.push(userWithId);
};

export const updateUser = (id:string, userData: UserNoId) => {
  //userData supposed to be validated erlier I believe
  const indexToUpdateUser = users.findIndex(user => id === user.id);

  users[indexToUpdateUser] = { ...users[indexToUpdateUser], ...userData };

};

export const deleteUser = (id: string) => {
  // validate id here or above? else throw error invalid id
  const indexToDeleteUser = users.findIndex(user => id === user.id);

  users.splice(indexToDeleteUser, 1);
};