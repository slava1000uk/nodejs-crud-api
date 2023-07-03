import http from "node:http";
import { User } from "./types/types";

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ data: 'Viacheslav Tyshchuk' }));
});

const PORT = Number(process.env.PORT || 4000);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});