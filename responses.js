// DATA EXAMPLE RESPONSE
// HEADER
resp[0] = 0x44;  // Magic String 4 bytes DSUS (S 0x53 serve or C 0x43 client)
resp[1] = 0x53;
resp[2] = 0x55;
resp[3] = 0x53;
resp[4] = 0xe9; // Protocol Version 2 bytes
resp[5] = 0x03;
resp[6] = 0x54; // Packet Length 2 bytes  = 84 resp, 100 in total with 16 bytes of header
resp[7] = 0x00;
resp[8] = 0x4a; // CRC32 4 bytes
resp[9] = 0xdb;
resp[10] = 0x17;
resp[11] = 0xfb;
resp[12] = 0x40; // Client Server ID 4 bytes
resp[13] = 0xda;
resp[14] = 0x1a;
resp[15] = 0x6b;
// --HEADER
resp[16] = 0x02; // Event Type 4 bytes // 100002 == controller -> Actual controllers data
resp[17] = 0x00;
resp[18] = 0x10;
resp[19] = 0x00;
resp[20] = 0x00; // Slot of the device we are reporting about (0)
resp[21] = 0x02; // Slot state, connected (2)
resp[22] = 0x02; // Device model, full gyro aka DS4 (2)
resp[23] = 0x02; // Connection type, bluetooth (2). (May be either USB (1) or Bluetooth (2))
resp[24] = 0x48; // MAC address of device (0x000000000001)
resp[25] = 0x18;
resp[26] = 0x8d;
resp[27] = 0xbc;
resp[28] = 0xea;
resp[29] = 0xc8;
resp[30] = 0x05; // Battery status, full (5)
resp[31] = 0x01; // Device state, active (1)
resp[32] = 0x81; // packetNumber
resp[33] = 0x01;
resp[34] = 0x00;
resp[35] = 0x00;
// We don't care about button, joystick and touchpad data, so we just their bytes to zero.
resp[36] = 0x00; // D-Pad Left, D-Pad Down, D-Pad Right, D-Pad Up, Options (?), R3, L3, Share (?)
resp[37] = 0x00; // Y, B, A, X, R1, L1, R2, L2 
resp[38] = 0x00; // PS Button (unused)
resp[39] = 0x00; // Touch Button (unused)
resp[40] = 0x7f; // Left stick X (plus rightward)
resp[41] = 0x7f; // Left stick Y (plus upward)
resp[42] = 0x7f; // Right stick X (plus rightward)
resp[43] = 0x7f; // Right stick Y (plus upward)
resp[44] = 0x00; // Analog D-Pad Left
resp[45] = 0x00; // Analog D-Pad Down
resp[46] = 0x00; // Analog D-Pad Right
resp[47] = 0x00; // Analog D-Pad Up
resp[48] = 0x00; // Analog Y
resp[49] = 0x00; // Analog B
resp[50] = 0x00; // Analog A
resp[51] = 0x00; // Analog X
resp[52] = 0x00; // Analog R1
resp[53] = 0x00; // Analog L1
resp[54] = 0x00; // Analog R2
resp[55] = 0x00; // Analog L2
resp[56] = 0x00; // Is first touch active?
resp[57] = 0x00; // First touch id
resp[58] = 0x00; // First touch X (16 bit)
resp[59] = 0x00; //...
resp[60] = 0x00; // First touch Y (16 bit)
resp[61] = 0x00; //...
resp[62] = 0x00; // Is second touch active?
resp[63] = 0x00; // Second touch id
resp[64] = 0x00; // Second touch X (16 bit)
resp[65] = 0x00; //...
resp[66] = 0x00; // Second touch Y (16 bit)
resp[67] = 0x00; //...
resp[68] = 0x31; // Timestamp in microseconds, begins at 0 and increases microtime since last gyro update
resp[69] = 0xef;
resp[70] = 0xc0;
resp[71] = 0x48;
resp[72] = 0x00;
resp[73] = 0x00;
resp[74] = 0x00;
resp[75] = 0x00;
resp[76] = 0x00; // Acceleration X
resp[77] = 0x00;
resp[78] = 0x85;
resp[79] = 0x3c;
resp[80] = 0x00; // Acceleration Y
resp[81] = 0xb0;
resp[82] = 0x75;
resp[83] = 0xbf;
resp[84] = 0x00; // Acceleration Z
resp[85] = 0x00;
resp[86] = 0x5f;
resp[87] = 0xbe;
resp[88] = 0x00; // Gyroscope Pitch
resp[89] = 0x00;
resp[90] = 0xfa;
resp[91] = 0x3d;
resp[92] = 0x00; // Gyroscope Yaw
resp[93] = 0x60;
resp[94] = 0x8c;
resp[95] = 0xbf;
resp[96] = 0x00; // Gyroscope Roll
resp[97] = 0x00;
resp[98] = 0x00;
resp[99] = 0x00;

// INFO RESPONSE EXAMPLE
// Magic server string (DSUS)
output[0] = 0;
output[1] = 1;
output[2] = 2;
output[3] = 3;
// Protocol version (1001)
output[4] = 4;
output[5] = 5;
// Packet length without header plus the length of event type (16)
output[6] = 6;
// Zero out CRC32 field
output[8] = 8;
// Set server id to some value (0)
output[12] = 12;
// Event type, controller information (0x00100001)
output[16] = 16;

// -- All non 0 slot, deactivated
// Slot of the device we are reporting about (i)
output[20] = 20;
output[21] = 21; // Slot state, not connected (0)
output[22] = 22; // Device model, not applicable (0)
output[23] = 23; // Connection type, not applicable (0)
// MAC address of device, not applicable (0x000000000000)
output[24] = 24;
output[25] = 25;
output[26] = 26;
output[27] = 27;
output[28] = 28;
output[29] = 29;
// Battery status, not applicable (0)
output[30] = 30; // ...
output[31] = 31; // Termination byte
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

// CLIENT REQUEST PAYLOAD EXAMPLE
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