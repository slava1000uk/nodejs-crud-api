import { IncomingMessage, ServerResponse, createServer } from "node:http";
import { config } from "dotenv";
import process from "node:process";
import { randomUUID } from "node:crypto";
import { HTTP_METHOD, HTTP_STATUS_CODE, DEFAULT_PORT, URL_BEFORE_ID_REGEXP } from "./constants";
import { UserNoId, UserWithId } from "./types/types";


const server = createServer((request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {
  
  const isEndpointAllUsers:boolean = 
        (request.url === '/api/users') || (request.url === '/api/users/');


  response.setHeader("Content-Type", "application/json");

  try {
    switch (request.method) {
      case HTTP_METHOD.GET:
        if (isEndpointAllUsers) {
          getAllUsers(response);

        } else {
          const id = request.url? getIdFromURL(request.url): '';
          if (id) { output = getUserById(id); }
        }
        break;

      case HTTP_METHOD.POST:
        if (isEndpointAllUsers) {
          createUser(request,response);
        }

      break;
    
      default:
        console.error(`${request.method} not working`);
        break;
    }
    
  } catch (error) {
    console.error(error);
  }


});

config();

const PORT = Number(process.env.PORT || DEFAULT_PORT);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});