const dgram = require('dgram');
var crc32 = require('buffer-crc32');

// Create a client socket
const client = dgram.createSocket('udp4');

function readUInt48LE(buffer, offset = 0) {
  let value = 0;
  for (let i = 0; i < 6; i++) {
    value += buffer[offset + i] * Math.pow(2, 8 * i);
  }
  return value;
}

client.on('message', (msg, rinfo) => {
  // console.log('Message from: ', rinfo.address, ' : ', rinfo.port);

  if (msg[16] !== 0x02) return;

  // HEADER
  let magicStri8ng = `${String.fromCharCode(msg[0])}${String.fromCharCode(msg[1])}${String.fromCharCode(msg[2])}${String.fromCharCode(msg[3])}`;
  let protocolVersion = msg.readUInt16LE(4);
  let packetLength = msg.readUInt16LE(6);
  let crc32sum = msg.readUInt32LE(8);
  let clientServerId = msg.readUInt32LE(12);
  // --HEADER
  let eventType = msg.readUInt32LE(16);
  let slot = msg.readUint8(20);
  let slotState = msg.readUint8(21);
  let deviceModel = msg.readUint8(22);
  let connectionType = msg.readUint8(23);
  let macAddress = readUInt48LE(msg, 24);
  let batteryStatus = msg.readUint8(30);
  let deviceState = msg.readUint8(31);
  let packetNumber = msg.readUint16LE(32);
  let dpad = msg.readUint8(36);
  let buttons = msg.readUint8(37);
  let psButton = msg.readUint8(38);
  let touchButton = msg.readUint8(39);
  let leftStickX = msg.readUint8(40);
  let leftStickY = msg.readUint8(41);
  let rightStickX = msg.readUint8(42);
  let rightStickY = msg.readUint8(43);
  let analogDpadLeft = msg.readUint8(44);
  let analogDpadDown = msg.readUint8(45);
  let analogDpadRight = msg.readUint8(46);
  let analogDpadUp = msg.readUint8(47);
  let analogY = msg.readUint8(48);
  let analogB = msg.readUint8(49);
  let analogA = msg.readUint8(50);
  let analogX = msg.readUint8(51);
  let analogR1 = msg.readUint8(52);
  let analogL1 = msg.readUint8(53);
  let analogR2 = msg.readUint8(54);
  let analogL2 = msg.readUint8(55);
  let firstTouchActive = msg.readUint8(56);
  let firstTouchId = msg.readUint8(57);
  let firstTouchX = msg.readUint16LE(58);
  let firstTouchY = msg.readUint16LE(60);
  let secondTouchActive = msg.readUint8(62);
  let secondTouchId = msg.readUint8(63);
  let secondTouchX = msg.readUint16LE(64);
  let secondTouchY = msg.readUint16LE(66);
  let timestamp = msg.readUint32LE(68);
  // gyro
  let accelerationX = msg.readFloatLE(76);
  let accelerationY = msg.readFloatLE(80);
  let accelerationZ = msg.readFloatLE(84);
  let gyroscopePitch = msg.readFloatLE(88);
  let gyroscopeYaw = msg.readFloatLE(92);
  let gyroscopeRoll = msg.readFloatLE(96);


  // console.log('>>>>>> HEADER');
  // console.log('Magic String: ', magicStri8ng);
  // console.log('Protocol Version: ', protocolVersion);
  // console.log('Packet Length: ', packetLength);
  // console.log('CRC32Sum1: ', crc32sum);
  // // Zero out CRC32 field
  // msg.writeUInt32LE(0, 8);
  // console.log('CRC32SUM2: ', crc32.unsigned(msg));
  // console.log('Client Server ID: ', clientServerId);
  // console.log('HEADER <<<<<<');
  // console.log('>>>>>> MSG');
  // console.log('Event Type: ', eventType.toString(16));
  // console.log('Slot: ', slot);
  // console.log('Slot State: ', slotState);
  // console.log('Device Model: ', deviceModel);
  // console.log('Connection Type: ', connectionType);
  // console.log('MAC Address: ', macAddress);
  // console.log('Battery Status: ', batteryStatus);
  // console.log('Device State: ', deviceState);
  // console.log('Packet Number: ', packetNumber);
  // // XBOX LAYOUT
  // console.log('D-Pad: ', dpad.toString(16)); // UP = 10, LEFT = 80, RIGHT = 20, DOWN = 40, SELECT = 1, START = 8, L3 = 2, R3 = 4
  // console.log('Buttons: ', buttons.toString(16)); // B = 20, a = 40, x = 80, y = 10, L = 4, R = 8, LT = 1, RT = 2
  // console.log('PS Button: ', psButton.toString(16)); // 255
  // console.log('Touch Button: ', touchButton.toString(16)); // 255
  // console.log('Left Stick X: ', leftStickX); // RIGHT = 255, LEFT = 0
  // console.log('Left Stick Y: ', leftStickY); // DOWN = 255, UP = 0
  // console.log('Right Stick X: ', rightStickX); // RIGHT = 255, LEFT = 0
  // console.log('Right Stick Y: ', rightStickY); // DOWN = 255, UP = 0
  // console.log('Analog D-Pad Left: ', analogDpadLeft); // left FULL = 255
  // console.log('Analog D-Pad Down: ', analogDpadDown); // down FULL = 255
  // console.log('Analog D-Pad Right: ', analogDpadRight); // RIGHT FULL = 255
  // console.log('Analog D-Pad Up: ', analogDpadUp); // UP FULL = 255
  // console.log('Analog X: ', analogY); // 255
  // console.log('Analog A: ', analogB); // 255
  // console.log('Analog B: ', analogA); // 255
  // console.log('Analog Y: ', analogX); // 255
  // console.log('Analog R1: ', analogR1); // 255
  // console.log('Analog L1: ', analogL1); // 255
  // console.log('Analog R2: ', analogR2);  // 255
  // console.log('Analog L2: ', analogL2);  // 255
  // console.log('First Touch Active: ', firstTouchActive);
  // console.log('First Touch ID: ', firstTouchId);
  // console.log('First Touch X: ', firstTouchX);
  // console.log('First Touch Y: ', firstTouchY);
  // console.log('Second Touch Active: ', secondTouchActive);
  // console.log('Second Touch ID: ', secondTouchId);
  // console.log('Second Touch X: ', secondTouchX);
  // console.log('Second Touch Y: ', secondTouchY);
  // console.log('Timestamp: ', timestamp);
  // console.log('Acceleration X: ', accelerationX);
  // console.log('Acceleration Y: ', accelerationY);
  // console.log('Acceleration Z: ', accelerationZ);
  // console.log('Gyroscope Pitch: ', gyroscopePitch); // z roll
  // console.log('Gyroscope Yaw: ', gyroscopeYaw); // esq uerda direita
  // console.log('Gyroscope Roll: ', gyroscopeRoll); // pitch


  // PS4 EVDEVHOOK2
  /* Holding normally, led facing tv

    Yaw (y) left (-) and right (+) like a traktor wheel
    |
    |  / Pitch (Z) forward (+) and backward (-)
    | /  
    |/_____________ Roll (X) left (-) and right (+)

    Accelerometer  ~= -1 to 1
    Gyroscope = degrees per second
    Acceleration Y: ~= -0.96 // Gravity
  **/
  // console.log('Acceleration X: ', accelerationX);
  // console.log('Acceleration Y: ', accelerationY);
  // console.log('Acceleration Z: ', accelerationZ);
  // console.log('Gyroscope Pitch: ', gyroscopePitch); // cima e baixo x
  // console.log('Gyroscope Yaw: ', gyroscopeYaw); // rotation y
  // console.log('Gyroscope Roll: ', gyroscopeRoll); // direita esquerda z
});

var msg = Buffer.alloc(28);

msg[0] = 0x44; // Magic String DSUC
msg[1] = 0x53;
msg[2] = 0x55;
msg[3] = 0x43;
msg[4] = 0xe9; // Protocol Version = 1001
msg[5] = 0x03;
msg[6] = 0x0c; // Packet Length
msg[7] = 0x00;
msg[8] = 0x62; // CRC32
msg[9] = 0x92;
msg[10] = 0x49;
msg[11] = 0x03;
msg[12] = 0x9f; // Client Server ID
msg[13] = 0x38;
msg[14] = 0x5c;
msg[15] = 0x5f;
msg[16] = 0x02; // Event Type = 100002
msg[17] = 0x00;
msg[18] = 0x10;
msg[19] = 0x00;
msg[20] = 0x00; // Slot of the device we are reporting about (0)
msg[21] = 0x00; // Slot state (0) = not connected
msg[22] = 0x00; // Device model, (0) = Not applicable
msg[23] = 0x00; // Connection type, (0) = Not applicable
msg[24] = 0x00; // MAC address of device, not applicable
msg[25] = 0x00;
msg[26] = 0x00;
msg[27] = 0x00;
msg[28] = 0x00;
msg[29] = 0x00;
msg[30] = 0x00; // Battery status, (0) = Not applicable
msg[31] = 0x00; // Termination byte


// let ip = 'localhost';
let ip = '192.168.15.6';
// let ip = '192.168.15.7';

client.send(msg, 26760, ip, (err) => {
  // client.close();
});

setInterval(() => {
  msg[16] = 0x01;
  client.send(msg, 26760, ip, (err) => {
    console.log('send');
    // client.close();
    msg[16] = 0x02;
    client.send(msg, 26760, ip, (err) => {
      console.log('send');
      // client.close();
    });
  });
}, 5000);