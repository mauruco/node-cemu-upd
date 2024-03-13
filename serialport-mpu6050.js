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
  // let ax = parseFloat(matches[0].slice(3));
  // let ay = parseFloat(matches[1].slice(3));
  // let az = parseFloat(matches[2].slice(3));
  // let gx = parseFloat(matches[3].slice(3));
  // let gy = parseFloat(matches[4].slice(3));
  // let gz = parseFloat(matches[5].slice(3));

  // const ax = -(parseFloat(matches[0].slice(3)) - 0.05);
  // const ay = -(parseFloat(matches[2].slice(3)) - 0.09);
  // const az = parseFloat(matches[1].slice(3)) - 0.24;
  // const roll = parseFloat(matches[4].slice(3)) + 14.7;
  // const pitch = -(parseFloat(matches[3].slice(3)) + 5.5);
  // const yaw = -(parseFloat(matches[5].slice(3)) + 9.9);

  const ax = -parseFloat(matches[0].slice(3));
  const ay = -parseFloat(matches[2].slice(3));
  const az = parseFloat(matches[1].slice(3));
  const roll = parseFloat(matches[4].slice(3));
  const pitch = -parseFloat(matches[3].slice(3));
  const yaw = -parseFloat(matches[5].slice(3));

  return {
    ax,
    ay,
    az,
    roll,
    pitch,
    yaw
  };
}

serialPort.on("open",  () =>{
  console.log('open');
  
  serialPort.on('data', (data) => {
    if (data.length > 10) {
      let gyroData = getGyroData(data.toString());
      // ax, ay, az, gx, gy, gz should look like PS4 controller
      // Compared with PS4 controller + evdevhook2
      // - Hold MPU6050 with all soldering points facing left
      // const ax = -(gyroData.ax + 0.01);
      // const ay = -(gyroData.az - 0.09);
      // const az = gyroData.ay - 0.1;
      // const roll = gyroData.gy + 14.8;
      // const pitch = -(gyroData.gx + 5.5);
      // const yaw = -(gyroData.gz + 9.9);
      // - Hold MPU6050 with all soldering points facing up
      // const ax = -(gyroData.ay);
      // const ay = -(gyroData.az - 0.07);
      // const az = -(gyroData.ax - 0.08);
      // const roll = -(gyroData.gx + 5.5);
      // const pitch = -(gyroData.gy + 14.8);
      // const yaw = -(gyroData.gz + 9.9);
      // console.log(gyroData);
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
