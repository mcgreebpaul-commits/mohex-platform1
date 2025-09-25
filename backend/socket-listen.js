/* Socket listener to register as a user and listen for 'tradeUpdate' events.
   Usage: set env var USER_ID and optionally SOCKET_IO_URL, then run: node socket-listen.js
*/

const io = require('socket.io-client');

const SOCKET_URL = process.env.SOCKET_IO_URL || 'http://localhost:3002';
const USER_ID = process.env.USER_ID || '1';

const socket = io(SOCKET_URL, { transports: ['websocket'] });

socket.on('connect', () => {
  console.log('connected to socket server', socket.id);
  socket.emit('register', Number(USER_ID));
  console.log('registered as user', USER_ID);
});

socket.on('tradeUpdate', (data) => {
  console.log('Received tradeUpdate:', data);
});

socket.on('disconnect', () => {
  console.log('disconnected');
});

socket.on('connect_error', (err) => {
  console.error('connect_error', err);
});
