import * as Userdatabase from "../userdatabase/userdatabase";
import { UserNoId, UserWithId } from "../types/types";
import { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS_CODE } from "../constants";
import { validUserId, validateUserKeys, validateUserFieldsType } from "../validations/validations";
import { getIdFromRequestURL, getDataFromRequest } from "../utils/utils";

export const getAllUsers = (response: ServerResponse) => {
  try {
    const allUsers = Userdatabase.getAll();

    response.statusCode = HTTP_STATUS_CODE.OK;
    response.end(JSON.stringify(allUsers));
    
  } catch (error) {
    console.error(error);
    // Correct Error message later: problem to get all users?
  }
};

export const getOneUser = (id: string, response: ServerResponse) => {
    if (validUserId(id, response)) {

      const user = Userdatabase.getUserById(id);

      if (!user) {
        response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
        response.end(JSON.stringify({ message: `User with id: ${id} not found`}));
      } else {
        response.statusCode = HTTP_STATUS_CODE.OK;
        response.end(JSON.stringify(user));
      }
    }
};

export const createUser = async (request: IncomingMessage, response: ServerResponse) => {
  try {
    const body = await getDataFromRequest(request);
    const userData = JSON.parse(body);

    if ( validateUserKeys(userData, response) && validateUserFieldsType(userData, response) ) {

      const newUser = Userdatabase.createUserWithId(userData);

      response.statusCode = HTTP_STATUS_CODE.CREATED;
      response.end(JSON.stringify(newUser));

    }
    
  } catch (error) {
    console.error('Problem with creating user');
  }
};

export const updateUser = async (id: string, request: IncomingMessage, response: ServerResponse) => {
  
  if (validUserId(id, response)) {

    const currentUser = Userdatabase.getUserById(id);

    if (!currentUser) {
      response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
      response.end(JSON.stringify({ message: `User with id: ${id} not found` }));
      return;
    }

      try {
        const body = await getDataFromRequest(request);
        const newUserData = JSON.parse(body);

        if (validateUserKeys(newUserData, response) && validateUserFieldsType(newUserData, response)) {

          const userDataToUpdate = {
            username: newUserData.username || currentUser.username,
            age: newUserData.age || currentUser.age,
            hobbies: newUserData.hobbies || currentUser.hobbies
          };

          const updatedUser = Userdatabase.updateUserById(id, userDataToUpdate);

          response.statusCode = HTTP_STATUS_CODE.OK;
          response.end(JSON.stringify(updatedUser));

        }

      } catch (error) {
        console.error('Problem with updating user');
      }

  }

};


export const deleteUser = async (id: string, response: ServerResponse) => {

  if (validUserId(id, response)) {

    const userToDelete = Userdatabase.getUserById(id);

    if (!userToDelete) {
      response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
      response.end(JSON.stringify({ message: `User with id: ${id} not found` }));
      return;
    }

    try {

      Userdatabase.removeUserById(id);

      response.statusCode = HTTP_STATUS_CODE.DELETED;
      response.end(JSON.stringify({ message: `User ${userToDelete} has been deleted!` }));

    } catch (error) {
      response.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
      response.end(JSON.stringify({ message: `Problem with deleting user ${userToDelete}` }));
      
      console.error('Problem with deleting user');
    }

  }

};


