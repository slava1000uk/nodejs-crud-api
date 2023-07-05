import { IncomingMessage, ServerResponse, createServer } from "node:http";
import { config } from "dotenv";
import process from "node:process";
import { randomUUID } from "node:crypto";
import { HTTP_METHOD, HTTP_STATUS_CODE, DEFAULT_PORT, URL_BEFORE_ID_REGEXP } from "./constants";




interface  UserNoId  {
  username: string;
  age: number;
  hobbies: string[];
};

interface UserWithId extends UserNoId {
  id: string;
};

let users: UserWithId[] = [];



const getAllUsers = () => users;


const getIdFromURL = (url: string):string => {
  let id = url.replace(URL_BEFORE_ID_REGEXP, '');

  if (id.endsWith('/')) {
    id = id.slice(0, id.length - 1);
  }

  return id;
};

const getUserById = (id: string) => {
  const userById = users.find(user => user.id === id);
  return userById;
};

const getDataFromPost = (request: IncomingMessage) => {
   let body ='';
   let result = {};

   request.on('data', (chunk) => {
    body += chunk;
   });

   request.on('end', () => {
    result = JSON.parse(body);
   });

   return result;
   
};

const validateDataFromPost = (body:UserNoId) => {
  const { username, age, hobbies } = body;

  return (typeof username === 'string' && 
          typeof age === 'number' &&
          Array.isArray(hobbies) &&
          hobbies.every(hobbie => typeof hobbie === 'string')
         );

};

const createUser = (request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {
  const body = getDataFromPost(request);// 1 get data from request
  if (validateDataFromPost(body)) {// 2 validate data
    
    const { username, age, hobbies } = body;
    
    //create id and make user with id
    const user = { ...body, id: randomUUID() };

    users.push(user);
  }

  return;

};



const server = createServer((request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {
  
  const isEndpointAllUsers:boolean = 
        (request.url === '/api/users') || (request.url === '/api/users/');
  
  let output: any;

  response.setHeader("Content-Type", "application/json");
  // response.statusCode = 200;
  // response.end(JSON.stringify({ data: 'Viacheslav Tyshchuk' }));

  try {
    switch (request.method) {
      case HTTP_METHOD.GET:
        if (isEndpointAllUsers) {
          output = getAllUsers();

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
  
  response.statusCode = HTTP_STATUS_CODE.OK;
  response.end(JSON.stringify(output));

});

config();

const PORT = Number(process.env.PORT || DEFAULT_PORT);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});