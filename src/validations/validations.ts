import { validate } from "uuid";
import { ServerResponse } from "node:http";
import { HTTP_STATUS_CODE } from "../constants";
import { UserNoId } from "../types/types";
 

export const validUserId = (id: string, response: ServerResponse) => {
  
  let isValid: boolean = true;

  if (!validate(id)) {
    isValid = false;
    response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
    response.end(JSON.stringify({ message: `Invalid user id: ${id}`}));
  }

  return isValid;
};



export const validateUserKeys = (userData: any, response: ServerResponse) => {

  const validKeys = ['username', 'age', 'hobbies'];

  const areKeysValid = Object.keys(userData).every(key => validKeys.includes(key));

  if (!areKeysValid) {
    response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
    response.end(JSON.stringify({ message: 'Invalid fields in user!' }));
  }
   
  return areKeysValid;

};


export const validateUserFieldsType = (user: UserNoId, response: ServerResponse) => {
  
  const isValid =
      typeof user.username === 'string' &&
      typeof user.age === 'number' &&
      Array.isArray(user.hobbies) &&
      user.hobbies.every(hobbie => typeof hobbie === 'string');
    
    if(!isValid) {
      response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
      response.end(JSON.stringify({ message: 'Invalid fields type in user!' }));
    }

    return isValid;
};