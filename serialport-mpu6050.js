// --------------------getting data from MPU6050 --------------------
const fs = require('fs');
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort( {
  path: "/dev/ttyACM0",
  baudRate: 9600
});

const getGyroData = (data) => {
  let regex = /#([^#]+)/g;
  let matches = data.match(regex);
  let ax = parseFloat(matches[0].slice(3));
  let ay = parseFloat(matches[1].slice(3));
  let az = parseFloat(matches[2].slice(3));
  let gx = parseFloat(matches[3].slice(3));
  let gy = parseFloat(matches[4].slice(3));
  let gz = parseFloat(matches[5].slice(3));
  return {
    ax,
    ay,
    az,
    gx,
    gy,
    gz
  };
}

serialPort.on("open",  () =>{
  console.log('open');
  
  serialPort.on('data', (data) => {
    if (data.length > 10) {
      let gyroData = getGyroData(data.toString());
      fs.writeFile('gyro-data.json', JSON.stringify(gyroData), (err) => {if (err) throw err; });
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
