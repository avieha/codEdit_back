const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
require('dotenv').config()

// using cors middleware
app.use(cors());

// I've created 4 different servers and sockets in order to manage each page comms in
// seperate.

const port1 = process.env.PORT || 10000;
// const port2 = process.env.PORT || 10001;
// const port3 = process.env.PORT || 10001;
// const port4 = process.env.PORT || 10001;

const io1 = new Server(server
    , {
    cors: {
        // origin: "https://code-edit24.netlify.app",
        methods: ["GET", "POST"],
    },
}
);

// const io2 = new Server(server2, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     },
// });

// const io3 = new Server(server3, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     },
// });

// const io4 = new Server(server4, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//     },
// });


io1.on("connection", function (socket) {

    // Array to store users' IPs
    let users = [];

    // number of users currently on page
    let count = 0;

    // Get user's IP address
    const userIP = socket.handshake.headers['x-real-ip'] || socket.handshake.address;

    // Check if the user is already in the list
    let userIndex = users.findIndex(user => user.ip === userIP);

    if (userIndex === -1) {
        count = count + 1;
        userIndex = count;
        users[userIndex] = { ip: userIP, currentPage: '/block1' };
    }

    console.log(`User connected with IP: ${userIP}`);

    socket.on('disconnect', () => {
        count = count - 1;
        users[userIndex] = 0;
        console.log("USERS: ");
        console.log(users);
        console.log(`User disconnected with IP: ${userIP} and now ${count} users.`);
    });

    // Handle changing pages
    socket.on('send_num', ({ currentPage }) => {
        // Update the current page for the user
        const userIndex = users.findIndex(user => user.ip === userIP);
        if (userIndex !== -1) {
            users[userIndex].currentPage = currentPage;
        }
        socket.broadcast.emit('receive_num', { count });
    });

    socket.on('send_code', ({ newCode }) => {
        // console.log("Data Received in server:" + newCode);

        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code', { newCode });
    });
});

// io2.on("connection", function (socket) {

//     // Array to store users' IPs
//     let users = [];

//     // number of users currently on page
//     let count = -1;

//     // Get user's IP address
//     const userIP = socket.handshake.headers['x-real-ip'] || socket.handshake.address;

//     // Check if the user is already in the list
//     let userIndex = users.findIndex(user => user.ip === userIP);

//     if (userIndex === -1) {
//         count = count + 1;
//         userIndex = count;
//         users[userIndex] = { ip: userIP, currentPage: '/block2' };
//     }

//     console.log(`User connected with IP: ${userIP}`);

//     socket.on('disconnect', () => {
//         count = count - 1;
//         users[userIndex] = 0;
//         console.log("USERS: ");
//         console.log(users);
//         console.log(`User disconnected with IP: ${userIP} and now ${users.length} users.`);
//     });

//     // Handle changing pages
//     socket.on('change_page', ({ currentPage }) => {
//         // Update the current page for the user
//         const userIndex = users.findIndex(user => user.ip === userIP);
//         if (userIndex !== -1) {
//             users[userIndex].currentPage = currentPage;
//         }
//     });

//     socket.on('send_code', ({ newCode }) => {
//         // console.log("Data Received in server:" + newCode);

//         // Broadcast the code changes to all clients
//         socket.broadcast.emit('receive_code', { newCode });
//     });
// });

// io3.on("connection", function (socket) {

//     // Array to store users' IPs
//     let users = [];

//     // number of users currently on page
//     let count = -1;

//     // Get user's IP address
//     const userIP = socket.handshake.headers['x-real-ip'] || socket.handshake.address;

//     // Check if the user is already in the list
//     let userIndex = users.findIndex(user => user.ip === userIP);

//     if (userIndex === -1) {
//         count = count + 1;
//         userIndex = count;
//         users[userIndex] = { ip: userIP, currentPage: '/block3' };
//     }

//     console.log(`User connected with IP: ${userIP}`);

//     socket.on('disconnect', () => {
//         count = count - 1;
//         users[userIndex] = 0;
//         console.log("USERS: ");
//         console.log(users);
//         console.log(`User disconnected with IP: ${userIP} and now ${users.length} users.`);
//     });

//     // Handle changing pages
//     socket.on('change_page', ({ currentPage }) => {
//         // Update the current page for the user
//         const userIndex = users.findIndex(user => user.ip === userIP);
//         if (userIndex !== -1) {
//             users[userIndex].currentPage = currentPage;
//         }
//     });

//     socket.on('send_code', ({ newCode }) => {
//         // console.log("Data Received in server:" + newCode);

//         // Broadcast the code changes to all clients
//         socket.broadcast.emit('receive_code', { newCode });
//     });
// });

// io4.on("connection", function (socket) {

//     // Array to store users' IPs
//     let users = [];

//     // number of users currently on page
//     let count = -1;

//     // Get user's IP address
//     const userIP = socket.handshake.headers['x-real-ip'] || socket.handshake.address;

//     // Check if the user is already in the list
//     let userIndex = users.findIndex(user => user.ip === userIP);

//     if (userIndex === -1) {
//         count = count + 1;
//         userIndex = count;
//         users[userIndex] = { ip: userIP, currentPage: '/block4' };
//     }

//     console.log(`User connected with IP: ${userIP}`);

//     socket.on('disconnect', () => {
//         count = count - 1;
//         users[userIndex] = 0;
//         console.log("USERS: ");
//         console.log(users);
//         console.log(`User disconnected with IP: ${userIP} and now ${users.length} users.`);
//     });

//     // Handle changing pages
//     socket.on('change_page', ({ currentPage }) => {
//         // Update the current page for the user
//         const userIndex = users.findIndex(user => user.ip === userIP);
//         if (userIndex !== -1) {
//             users[userIndex].currentPage = currentPage;
//         }
//     });

//     socket.on('send_code', ({ newCode }) => {
//         // console.log("Data Received in server:" + newCode);

//         // Broadcast the code changes to all clients
//         socket.broadcast.emit('receive_code', { newCode });
//     });
// });

server.listen(port1, () => {
    console.log(`running, listening on port ${port1}`);
});
// server2.listen(port2, () => {
//     console.log(`running, listening on port ${port2}`);
// });
// server3.listen(port3, () => {
//     console.log(`running, listening on port ${port3}`);
// });
// server4.listen(port4, () => {
//     console.log(`running, listening on port ${port4}`);
// });