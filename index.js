import { WebSocketServer } from 'ws';
import * as fs from "fs"

const wss = new WebSocketServer({ port: 8080 });
let counter = 42069;
let clients = [];
let updateFreq = 10;

if(!fs.existsSync('./counter.txt')){
  fs.writeFileSync('./counter.txt', "0");
}else{
  counter = fs.readFileSync("./counter.txt");
}

wss.on('connection', function connection(ws) {
  ws.send(counter);

  // setInterval(() => {
  ws.send(counter);
  // }, updateFreq);

  ws.on('message', function message(data) {
    // console.log(data.toString());
    // if(data.toString() == "DATA"){
    //   ws.send(counter);
    //   console.log("N: " + counter.toString());
    // }
    if (data.toString() == "INC") {
      counter++;
      console.log(counter);
      wss.clients.forEach(function each(client) {
        client.send(counter); // send to all clients
      });
      //update the counter file
      fs.writeFileSync('./counter.txt', String(counter));
    }

  });
  console.log("Client connected");
});

wss.broadcast = function broadcast(msg) {
  console.log(msg);
  wss.clients.forEach(function each(client) {
    client.send(msg);
  });
};