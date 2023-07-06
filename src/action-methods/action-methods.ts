import * as Userdatabase from "../userdatabase/userdatabase";
import { UserNoId, UserWithId } from "../types/types";
import { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS_CODE } from "../constants";
import { validUserId, validateUserKeys, validateUserFieldsType } from "../validations/validations";

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
        //send handleUserNotFound(id, response) user not found
      } else {
        response.statusCode = HTTP_STATUS_CODE.OK;
        response.end(JSON.stringify(user));
      }
    }
};

export const createUser = (request: IncomingMessage, response: ServerResponse) => {
  try {
    const userData = getDataFromPostRequest(request);

    if ( validateUserKeys(userData, response) && validateUserFieldsType(userData, response) ) {

      const newUser = Userdatabase.createUserWithId(userData);

      response.statusCode = HTTP_STATUS_CODE.CREATED;
      response.end(JSON.stringify(newUser));

    }
    
  } catch (error) {
    console.error('Problem with creating user');
  }
};

