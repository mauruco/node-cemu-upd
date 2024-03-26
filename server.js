// --------------------creating a udp server --------------------
const fs = require('fs');
var udp = require('dgram');
var crc32 = require('buffer-crc32');
var decode = require('./make-responses');


// creating a udp server
var server = udp.createSocket('udp4');

// emits when any error occurs
server.on('error', function (error) {
  console.log('Error: ' + error);
  server.close();
});

let gyroData = {
  ax: 0.0,
  ay: 0.0,
  az: 0.0,
  roll: 0.0,
  pitch: 0.0,
  yaw: 0.0
};

// emits on new datagram msg
server.on('message', (msg, info) => {
  console.log('Data received from client : ' + Date.now()  + msg.toString());

    // HEADER
    let magicStri8ng = `${String.fromCharCode(msg[0])}${String.fromCharCode(msg[1])}${String.fromCharCode(msg[2])}${String.fromCharCode(msg[3])}`;
    let protocolVersion = msg.readUInt16LE(4);
    let packetLength = msg.readUInt16LE(6);
    let crc32sum = msg.readUInt32LE(8);
    let clientServerId = msg.readUInt32LE(12);
    // --HEADER
    let eventType = msg.readUInt32LE(16);

    console.log('>>>>>> HEADER');
    console.log('Magic String: ', magicStri8ng);
    console.log('Protocol Version: ', protocolVersion);
    console.log('Packet Length: ', packetLength);
    console.log('CRC32Sum: ', crc32sum);
    // Zero out CRC32 field
    msg.writeUInt32LE(0, 8);
    console.log('CRC32SUM2: ', crc32.unsigned(msg));
    console.log('Client Server ID: ', clientServerId);
    console.log('HEADER <<<<<<');
    console.log('>>>>>> MSG');
    console.log('Event Type: ', eventType.toString(16));
    console.log('msg.length: ', msg.length);

  let event = msg.readUInt8(16); // udpIn[16] - Least significant byte of event type

  // controller info
  if (event === 0x01) {
    let responses = decode(msg);
    responses.forEach(res => {
      server.send(res, info.port, 'localhost', (error) => {
        if (error) {
          client.close();
          console.log('Error !!!');
        } else {
          // console.log(`0x01 Sent packet`);
        }
      });
    });
    return;
  }

  // 1. send for 6 seconds
  let id = setInterval(() => {
    
    // gyro data
    try {
      const gd = JSON.parse(fs.readFileSync('gyro-data.json', 'utf8'));
      gyroData = gd;
    } catch (error) {
      // console.log('error:', error);
    }

    let response = decode(msg, gyroData)[0];

    server.send(response, info.port, 'localhost', function (error) {
      if (error) {
        client.close();
        console.log('Error !!!');
      } else {
        //
      }
    });
  }, 20);
  setTimeout(() => {
    clearInterval(id);
  }, 6000);
});

//emits when socket is ready and listening for datagram msgs
server.on('listening', function () {
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port' + port);
  console.log('Server ip :' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);
});

//emits after the socket is closed using socket.close();
server.on('close', function () {
  console.log('Socket is closed !');
});

server.bind(26760);
