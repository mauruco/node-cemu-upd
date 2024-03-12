# node-cemu-upd
Understanding how the Cemu protocol works

# Protocol: https://v1993.github.io/cemuhook-protocol/
# This resource was very helpful: https://github.com/KerJoe/MPU6050-Cemuhook-gyro

# When eventType = 0x01, create an info-response for each slot
# When eventType = 0x02, create a data-response for each slot (or only for the active one) with controller data
# When eventType = 0x02, spam response for ~6 seconds then stop if no more eventType 0x02 is received