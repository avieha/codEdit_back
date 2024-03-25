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

const port = process.env.PORT || 10000;
const io = new Server(server
    , {
        cors: {
            methods: ["GET", "POST"],
        },
    }
);

// Define a route to get the user's IP address
app.get('/get_ip', (req, res) => {
    // Get the IP address from the request object
    const userIP = req.ip;
});

io.on("connection", function (socket) {
    // Array to store users' IPs
    let users = [];

    socket.on('disconnect', () => {
        // Remove user from the array on disconnect
        const userIP = socket.handshake.headers['x-real-ip'] || socket.handshake.address;
        users = users.filter(user => user.ip !== userIP);
        console.log(`User disconnected with IP: ${userIP}`);
    });

    // Handle changing pages
    socket.on('page_change', ({ currentPage }) => {

        console.log("Page Change: " + currentPage);
        const userIP = socket.handshake.headers['x-real-ip'] || socket.handshake.address;
        // Check if the user is already in the list
        let userIndex = users.findIndex(user => user.ip === userIP);
        if (userIndex === -1) {
            // Push new user to the array
            users.push({ ip: userIP, currentPage: currentPage });
        } else {
            users[userIndex].currentPage = currentPage;
        }

        // Console log and iterate over users' IPs
        console.log("Users' IPs:");
        users.forEach(user => {
            console.log(user.ip);
        });

        socket.broadcast.emit('receive_users', { count: users.length });
    });

    socket.on('send_code1', ({ newCode1 }) => {
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code1', { newCode1 });
    });

    socket.on('send_code2', ({ newCode2 }) => {
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code2', { newCode2 });
    });

    socket.on('send_code3', ({ newCode3 }) => {
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code3', { newCode3 });
    });

    socket.on('send_code4', ({ newCode4 }) => {
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code4', { newCode4 });
    });

});

server.listen(port, () => {
    console.log(`running, listening on port ${port}`);
});