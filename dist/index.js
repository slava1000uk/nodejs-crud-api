import http from "node:http";
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ data: 'Viacheslav Tyshchuk' }));
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
