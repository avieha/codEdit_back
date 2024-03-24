const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
require('dotenv').config()

// using cors middleware
app.use(cors());

// I've created Server to talk with the client, sending code
// changes on-line and managing users on different pages.

const port1 = process.env.PORT || 10000;
const io = new Server(server
    , {
        cors: {
            methods: ["GET", "POST"],
        },
    }
);

io.on("connection", function (socket) {

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
    socket.on('page_change', ({ currentPage }) => {
        // Update the current page for the user
        const userIndex = users.findIndex(user => user.ip === userIP);
        if (userIndex !== -1) {
            users[userIndex].currentPage = currentPage;
        }
        socket.broadcast.emit('receive_num', { count });
    });

    socket.on('send_code1', ({ newCode }) => {
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code1', { newCode });
    });

    socket.on('send_code2', ({ newCode }) => {
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code2', { newCode });
    });

    socket.on('send_code3', ({ newCode }) => {
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code3', { newCode });
    });

    socket.on('send_code4', ({ newCode }) => {
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code4', { newCode });
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