import { IncomingMessage, ServerResponse, createServer }  from "node:http";
import http from "node:http";
import { config } from "dotenv";
import process, { pid } from "node:process";
import { HTTP_METHOD, HTTP_STATUS_CODE, DEFAULT_PORT } from "./constants";
import { getAllUsers, getOneUser, createUser, updateUser, deleteUser } from "./action-methods/action-methods";
import { getIdFromRequestURL, hasRequestUrlId, getDataFromRequest } from "./utils/utils"

import cluster, { Worker } from 'cluster';
import { cpus } from 'os';

import { UserWithId } from "./types/types";



const server = createServer(async (request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {

  const isEndpointUsers: boolean =
    (request.url === '/api/users') || (request.url === '/api/users/');


  response.setHeader("Content-Type", "application/json");

  try {
    switch (request.method) {
      case HTTP_METHOD.GET:
        if (isEndpointUsers) {
          await getAllUsers(response);

        } else if (request.url && hasRequestUrlId(request.url)) {
          const id = getIdFromRequestURL(request.url);
          await getOneUser(id, response);
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


if (cluster.isPrimary) {

  let currentServer: number = 0;
  const workers: Worker[] = [];
  const servers: string[] = [];
  const ports: number[] = [];

  
  cpus().forEach((_, i) => {
    workers.push(cluster.fork());

    servers.push(`http://localhost:${PORT + i + 1}`);
    ports.push(PORT + i + 1);
  });
  
  
  workers.forEach((worker) => {
    worker.on('message', (users: UserWithId[]) => {
      workers.forEach(w => w.send(users));
      });
    });





  const primaryServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    
    res.setHeader('Content-Type', 'application/json');

    const requestData = (req.method === HTTP_METHOD.POST || req.method === HTTP_METHOD.PUT) ? await getDataFromRequest(req) : JSON.stringify({});
    
   

    currentServer === (servers.length - 1) ? currentServer = 0 : currentServer++;

    const destination = `${servers[currentServer]}${req.url}`

    console.log(`\nSending request to [${req.method}] ${destination}\n`)

    const options = {
      hostname: '127.0.0.1',
      port: ports[currentServer],
      path: req.url,
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
      },
    };

    const request = http.request(options, async (response: any) => {
      response.setEncoding('utf8');
      res.statusCode = response.statusCode;
      if (response.statusCode == 204) {
        res.end()
      }
      response.on('data', (chunk: any) => {
        res.end(chunk);
      });
    });

    if (req.method !== HTTP_METHOD.GET) {
      request.write(requestData);
    }

    request.end();
  });

  primaryServer.listen(PORT, () => {
    console.log(`\nPrimary process: ${pid} is running on port ${PORT}!`);
  })
  

} else {

  const workerId: number = (cluster.worker as Worker).id;
  const WORKER_PORT: number = PORT + workerId;


  server.listen(WORKER_PORT, () => {
    console.log(`\nWorker process: ${pid} started on port ${WORKER_PORT}`);
  });

}
