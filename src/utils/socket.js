import io from 'socket.io-client'

const socket = io("http://localhost:3002")

console.log("hola");

export default socket