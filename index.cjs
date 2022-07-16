require('dotenv').config()
console.log(process.env)
const express = require('express');
const app = express();
const path = require('path');
const { proxy, scriptUrl } = require('rtsp-relay')(app);
const DVR_IP = process.env.DVR_IP;
const DVR_PORT = process.env.DVR_PORT | 554;
const DVR_USER = process.env.DVR_USER;
const DVR_PASSWORD = process.env.DVR_PASSWORD;
const DVR_STREAM = process.env.DVR_STREAM | 0; //0 -> Main Stream 1 (HD) -> Extra Stream (SD)
const port = process.env.PORT | 2000;


const handler  = (ws,req) => {
      return proxy({
      url: `rtsp://${DVR_USER}:${DVR_PASSWORD}@${DVR_IP}:${DVR_PORT}/cam/realmonitor?channel=${req.params.id}&subtype=${DVR_STREAM}`,
      // if your RTSP stream need credentials, include them in the URL as above
      additionalFlags: [ "-an",
      "-b:v", "500k",
      "-fflags", "nobuffer",'-s', '960x540'],
      // additionalFlags: ["-q", "1"],
      // additionalFlags: ["-q", "1",'-s','960x540'],
      // transport:'tcp',
      verbose: true,
    })(ws);
};



// the endpoint our RTSP uses
app.ws('/api/stream/:id', handler);
// app.ws('/api/stream/:id', cam3);

// this is an example html page to view the stream
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public', '/player.html'));
});

app.listen(port, data=>{
  console.log(`[Server] Running on Port ${port}`)
})