var udp = require('dgram');
var decode = require('./make-responses');

// --------------------creating a udp server --------------------

// creating a udp server
var server = udp.createSocket('udp4');

// emits when any error occurs
server.on('error', function (error) {
  console.log('Error: ' + error);
  server.close();
});

function readUInt48LE(buffer, offset) {
  let lower = buffer.readUInt32LE(offset);
  let upper = buffer.readUInt16LE(offset + 4);
  return (upper << 32) + lower;
}

// emits on new datagram msg
server.on('message', function (msg, info) {

  let event = msg.readUInt8(16); // udpIn[16] - Least significant byte of event type
  
  // controller info
  if (event === 0x01) {
    let responses = decode(msg);
    responses.forEach(res => {
      server.send(res, info.port, 'localhost', function (error) {
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
    let response = decode(msg)[0];
    let timestamp = readUInt48LE(response, 68);
    let packetNumber = response.readUint16LE(32);
    server.send(response, info.port, 'localhost', function (error) {
      if (error) {
        client.close();
        console.log('Error !!!');
      } else {
        // console.log(`0x02 Sent packet ${packetNumber} at ${timestamp}`);
      }
    });
  }, 100);
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
