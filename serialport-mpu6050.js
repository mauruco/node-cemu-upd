// --------------------getting data from MPU6050 --------------------
const fs = require('fs');
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort( {
  path: "/dev/ttyACM0",
  baudRate: 9600
});

serialPort.on("open",  () =>{
  console.log('open');
  
  serialPort.on('data', (data) => {
    if (data.length > 10) {
      fs.writeFile('gyro-data.json', data.toString(), (err) => {if (err) throw err; });
    }
  });
  
  // serialPort.write(Buffer.alloc(4), (err, results) => {
  //   console.log('err ' + err);
  //   console.log('results ' + results);
  // });
});

// setTimeout(() => {

//   serialPort.close((err) => {
//     if (err) {
//       return console.log('Error closing port: ', err.message);
//     }
//     console.log('Port closed');
//     console.log(incomingData);
//   });

// }, 3000);
