import { IncomingMessage, ServerResponse, createServer } from "node:http";
// import { User } from "./types/types";

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


const URL_BEFORE_ID_REGEXP:RegExp = /^\/api\/users\/$/;

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



const server = createServer((request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {
  
  const isUrlEndsWithUsers:boolean = 
        (request.url === '/api/users') || (request.url === '/api/users/');
  
  let output: any;

  response.setHeader("Content-Type", "application/json");
  // response.statusCode = 200;
  // response.end(JSON.stringify({ data: 'Viacheslav Tyshchuk' }));

  try {
    switch (request.method) {
      case 'GET':
        if (isUrlEndsWithUsers) {
          output = getAllUsers();

        } else {
          const id = request.url? getIdFromURL(request.url): '';
          if (id) { output = getUserById(id); }
        }
        break;
    
      default:
        console.error(`${request.method} not working`);
        break;
    }
    
  } catch (error) {
    console.error(error);
  }
  
  response.statusCode = 200;
  response.end(JSON.stringify(output));

});


const DEFAULT_PORT:number = 4000;
const PORT = Number(process.env.PORT || DEFAULT_PORT);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});