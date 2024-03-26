var crc32 = require('buffer-crc32');

const makeInfoResponse = (slot) => {
  let output = Buffer.alloc(32); // 0x0 as default
  // Magic server string (DSUS)
  output.writeInt8(0x44, 0);
  output.writeInt8(0x53, 1);
  output.writeInt8(0x55, 2);
  output.writeInt8(0x53, 3);
  // Protocol version (1001)
  output.writeUInt16LE(0xE9, 4);
  output.writeUInt16LE(0x03, 5);
  // Packet length without header plus the length of event type (16)
  output.writeUInt16LE(16, 6);
  // Zero out CRC32 field
  output.writeUInt32LE(0, 8);
  // Set server id to some value (0)
  output.writeUInt32LE(0, 12);
  // Event type, controller information (0x00100001)
  output.writeUInt32LE(0x00100001, 16);

  // -- All non 0 slot, deactivated
  // Slot of the device we are reporting about (i)
  output.writeUint8(slot,20);
  output.writeUint8(0x00,21); // Slot state, not connected (0)
  output.writeUint8(0x00,22); // Device model, not applicable (0)
  output.writeUint8(0x00,23); // Connection type, not applicable (0)
  // MAC address of device, not applicable (0x000000000000)
  output.writeUint8(0x00,24);
  output.writeUint8(0x00,25);
  output.writeUint8(0x00,26);
  output.writeUint8(0x00,27);
  output.writeUint8(0x00,28);
  output.writeUint8(0x00,29);
  // Battery status, not applicable (0)
  output.writeUint8(0x00,30); // ...
  output.writeUint8(0x00,31); // Termination byte
  // All non 0 slot, deactivated --
 
  // Controller 0 is the only active controller
  if (slot == 0) {
    output[21] = 0x02; // Slot state, connected (2)
    output[22] = 0x02; // Device model, full gyro aka DS4 (2)
    output[23] = 0x02; // Connection type, bluetooth (2). (May be either USB (1) or Bluetooth (2))
    // MAC address of device (0x000000000001)
    output[24] = 0x01; 
    // Battery status, full (5)
    output[30] = 0x05; // ...
  }
   
  output.writeUInt32LE(crc32.unsigned(output), 8);
  return output;
};

function writeUInt48LE(buffer, value, offset) {
  buffer.writeUInt32LE(value & 0xFFFFFFFF, offset);
  buffer.writeUInt16LE((value >> 32) & 0xFFFF, offset + 4);
}

let packetNumber = 0;
let before = 0;
let microseconds = 0;


makeDataResponse = (gyroData) => {
  let output = Buffer.alloc(100); // already 0x0 as default
  // Magic server string (DSUS)
  output.writeInt8(0x44, 0);
  output.writeInt8(0x53, 1);
  output.writeInt8(0x55, 2);
  output.writeInt8(0x53, 3);
  // Protocol version (1001)
  output.writeUInt8(0xE9, 4);
  output.writeUInt8(0x03, 5);
  // Packet length without header plus the length of event type (4)
  output.writeUInt16LE(84, 6);
  // Zero out CRC32 field
  output.writeUInt32LE(0, 8);
  // Set server id to some value (0)
  output.writeUInt32LE(0, 12);
  // Event type, controller data (0x00100002)
  output.writeUInt32LE(0x00100002, 16);
  // --
  output.writeInt8(0x00,20); // Slot of the device we are reporting about (0)
  output.writeInt8(0x02,21); // Slot state, connected (2)
  output.writeInt8(0x02,22); // Device model, full gyro aka DS4 (2)
  output.writeInt8(0x02,23); // Connection type, bluetooth (2). (May be either USB (1) or Bluetooth (2))
  // MAC address of device (0x000000000001)
  output.writeInt8(0x01,24); 
  output.writeInt8(0x00,25);
  output.writeInt8(0x00,26);
  output.writeInt8(0x00,27);
  output.writeInt8(0x00,28);
  output.writeInt8(0x00,29);
  // Battery status, full (5)
  output.writeInt8(0x05,30); // ...
  // Device state, active (1)
  output.writeInt8(0x01,31);
  // Copy from packetCount to packet array 
  output.writeUInt32LE(packetNumber++, 32);
  // We don't care about button, joystick and touchpad data, so we just their bytes to zero.
  output.writeUInt8(0x00, 36); // D-Pad Left, D-Pad Down, D-Pad Right, D-Pad Up, Options (?), R3, L3, Share (?)
  output.writeUInt8(0x00, 37); // Y, B, A, X, R1, L1, R2, L2 
  output.writeUInt8(0x00, 38); // PS Button (unused)
  output.writeUInt8(0x00, 39); // Touch Button (unused)
  output.writeUInt8(0x00, 40); // Left stick X (plus rightward)
  output.writeUInt8(0x00, 41); // Left stick Y (plus upward)
  output.writeUInt8(0x00, 42); // Right stick X (plus rightward)
  output.writeUInt8(0x00, 43); // Right stick Y (plus upward)
  output.writeUInt8(0x00, 44); // Analog D-Pad Left
  output.writeUInt8(0x00, 45); // Analog D-Pad Down
  output.writeUInt8(0x00, 46); // Analog D-Pad Right
  output.writeUInt8(0x00, 47); // Analog D-Pad Up
  output.writeUInt8(0x00, 48); // Analog Y
  output.writeUInt8(0x00, 49); // Analog B
  output.writeUInt8(0x00, 50); // Analog A
  output.writeUInt8(0x00, 51); // Analog X
  output.writeUInt8(0x00, 52); // Analog R1
  output.writeUInt8(0x00, 53); // Analog L1
  output.writeUInt8(0x00, 54); // Analog R2
  output.writeUInt8(0x00, 55); // Analog L2
  output.writeUInt8(0x00, 56); // Is first touch active?
  output.writeUInt8(0x00, 57); // First touch id
  output.writeUInt8(0x00, 58); // First touch X (16 bit)
  output.writeUInt8(0x00, 59); //...
  output.writeUInt8(0x00, 60); // First touch Y (16 bit)
  output.writeUInt8(0x00, 61); //...
  output.writeUInt8(0x00, 62); // Is second touch active?
  output.writeUInt8(0x00, 63); // Second touch id
  output.writeUInt8(0x00, 64); // Second touch X (16 bit)
  output.writeUInt8(0x00, 65); //...
  output.writeUInt8(0x00, 66); // Second touch Y (16 bit)
  output.writeUInt8(0x00, 67); //...

  // timestamp
  // micro time passed
  var hrTime = process.hrtime()
  now = hrTime[0] * 1000000 + hrTime[1] / 1000;
  microseconds += Math.floor((now - before) / 1000);
  before = now;
  writeUInt48LE(output, microseconds, 68);

  // Acceleration X
  output.writeFloatLE(gyroData.ax, 76);
  // Acceleration Y
  output.writeFloatLE(gyroData.ay, 80);
  // Acceleration Z
  output.writeFloatLE(gyroData.az, 84);
  // Gyroscope Pitch
  output.writeFloatLE(gyroData.pitch, 88);
  // Gyroscope Yaw
  output.writeFloatLE(gyroData.yaw, 92);
  // Gyroscope Roll
  output.writeFloatLE(gyroData.roll, 96);

  // crc
  output.writeUInt32LE(crc32.unsigned(output), 8);

  return output;
};

const decode = (msg, gyroData) => {

  let responses = [];

  // HEADER
  let magicString = `${String.fromCharCode(msg[0])}${String.fromCharCode(msg[1])}${String.fromCharCode(msg[2])}${String.fromCharCode(msg[3])}`;
  let protocolVersion = msg.readUInt16LE(4);
  let packetLength = msg.readUInt16LE(6);
  let crc32sum = msg.readUInt32LE(8);
  let clientServerId = msg.readUInt32LE(12);
  // --HEADER
  let eventType = msg.readUInt32LE(16);
  let event = msg.readUInt8(16); // udpIn[16] - Least significant byte of event type
  let portsAmount = msg.readUInt8(20); // udpIn[17] - Amount of ports we should report


  // “Information about connected controllers” response
  if (event === 0x01) {
    for (let i = 0; i < portsAmount; i++) {
      responses.push(makeInfoResponse(msg.readUInt8(24 + i)));
    }
  }

  // “Actual controllers data” response
  if (event === 0x02) {
    responses.push(makeDataResponse(gyroData));
  }

  return responses;
};

module.exports = decode;