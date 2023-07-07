import { IncomingMessage, ServerResponse, createServer } from "node:http";
import { config } from "dotenv";
import process from "node:process";
import { randomUUID } from "node:crypto";
import { HTTP_METHOD, HTTP_STATUS_CODE, DEFAULT_PORT, URL_BEFORE_ID_REGEXP } from "./constants";
import { UserNoId, UserWithId } from "./types/types";
import { getAllUsers, getOneUser, createUser, updateUser, deleteUser } from "./action-methods/action-methods";
import { getIdFromRequestURL, hasRequestUrlId } from "./utils/utils"



const server = createServer( async (request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {
  
  const isEndpointUsers:boolean = 
        (request.url === '/api/users') || (request.url === '/api/users/');


  response.setHeader("Content-Type", "application/json");

  try {
    switch (request.method) {
      case HTTP_METHOD.GET:
        if (isEndpointUsers) {
          getAllUsers(response);

        } else if (request.url && hasRequestUrlId(request.url)) {
          const id = getIdFromRequestURL(request.url);
          getOneUser(id, response);
        } else {
          response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
          response.end(JSON.stringify({
            message: request.url ? "Url doesn't have user id" : "Url is not correct" 
          }));
        }
        break;


      case HTTP_METHOD.POST:
        if (isEndpointUsers) {
          await createUser(request, response);
        } else {
          response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
          response.end(JSON.stringify({ message: "Url is not correct" }));
        }
      break;


      case HTTP_METHOD.PUT:
        if (request.url && hasRequestUrlId(request.url)) {
          const id = getIdFromRequestURL(request.url);
          await updateUser(id, request, response);
        } else {
          response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
          response.end(JSON.stringify({
            message: request.url ? "Url doesn't have user id" : "Url is not correct"
          }));
        }
      break;


      case HTTP_METHOD.DELETE:
        if (request.url && hasRequestUrlId(request.url)) {
          const id = getIdFromRequestURL(request.url);
          await deleteUser(id, response);
        } else {
          response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
          response.end(JSON.stringify({
            message: request.url ? "Url doesn't have user id" : "Url is not correct"
          }));
        }
        break;

    }
  } catch (error) {
    console.error("Url is not correct");
  }


});

config();

const PORT = Number(process.env.PORT || DEFAULT_PORT);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});