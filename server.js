// --------------------creating a udp server --------------------
const fs = require('fs');
var udp = require('dgram');
var decode = require('./make-responses');


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
  // console.log('Data received from client : ' + msg.toString());

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
    // gyro data
    let gyroData = {
      ax: 0.0,
      ay: 0.0,
      az: 0.0,
      gx: 0.0,
      gy: 0.0,
      gz: 0.0
    }
    try {
      const gd = JSON.parse(fs.readFileSync('gyro-data.json', 'utf8'));

      const offsetTable = {
        accXI: -2818, // accXI
        accYI: 2461, // accYI
        accZI: 1148, // accZI
        gyrPI: -47, // gyrPI
        gyrYI: -72, // gyrYI
        gyrRI: 35, // gyrRI
      };

      gyroData.ax = gd.ax + 0.0000000000001;
      gyroData.ay = gd.ay + 0.0000000000001;
      gyroData.az = (-gd.az) + 0.0000000000001;
      gyroData.gx = (-gd.gx) + 0.0000000000001;  // roll
      gyroData.gy = gd.gy + 0.0000000000001;  // pitch
      gyroData.gz = (-gd.gz) + 0.0000000000001;  // yaw
      // gyroData.ax = gd.ax + offsetTable.accXI;
      // gyroData.ay = gd.ay + offsetTable.accYI;
      // gyroData.az = -gd.az + offsetTable.accZI;
      // gyroData.gx = -gd.gx + offsetTable.gyrPI;  // roll
      // gyroData.gy = gd.gy + offsetTable.gyrYI;  // pitch
      // gyroData.gz = -gd.gz + offsetTable.gyrRI;  // yaw
      console.log('gyroData:', gyroData);
    } catch (error) {
      // console.log('error:', error);
    }
    // Acceleration X
    response.writeFloatLE(gyroData.ax, 76);
    // Acceleration Y
    response.writeFloatLE(gyroData.ay, 80);
    // Acceleration Z
    response.writeFloatLE(gyroData.az, 84);
    // Gyroscope Pitch
    response.writeFloatLE(gyroData.gy, 88);
    // Gyroscope Yaw
    response.writeFloatLE(gyroData.gz, 92);
    // Gyroscope Roll
    response.writeFloatLE(gyroData.gx, 96);

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
