import { URL_BEFORE_ID_REGEXP } from "../constants";
import { IncomingMessage } from "node:http";

export const getIdFromRequestURL = (url: string): string => {
  let id = url.replace(URL_BEFORE_ID_REGEXP, '');

  if (id.endsWith('/')) {
    id = id.slice(0, id.length - 1);
  }

  return id;
};

export const getDataFromPostRequest = (request: IncomingMessage): Promise<string> => {
  
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

    } catch (error) {
      reject(error);
    }
  });

};