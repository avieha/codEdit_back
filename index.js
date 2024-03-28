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

// Array to store users' IDs, and their current page
let users = [];
let userIdRec = -1;

io.on("connection", function (socket) {
    console.log("------------------------");
    console.log("Connection established");

    // Handle changing pages
    socket.on('page_change', ({ currentPage, userId }) => {
        userIdRec = userId;

        // Check if the user is already in the list
        userIndex = users.findIndex(user => user.userId === userId);
        if (userIndex === -1) {
            // Push new user to the array
            users.push({ userId: userId, currentPage: currentPage });
        } else {
            users[userIndex].currentPage = currentPage;
        }

        let firstUserIndex = -1;
        // let the client know if he is a mentor
        for (let i = 0; i < users.length; i++) {
            if (users[i].currentPage === currentPage) {
                firstUserIndex = i;
                break;
            }
        }
        firstUser = users[firstUserIndex].userId;
        console.log("first user: " + firstUser);
        socket.broadcast.emit('receive_users', { firstUser });

        // Console log and iterate over users' IDs+
        console.log(" Users table:");
        users.forEach(user => {
            console.log(user);
        });
    });

    // first code block
    socket.on('send_code1', ({ newCode }) => {
        console.log("send_code1: " + newCode);
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code1', { newCode });
    });
    // second code block
    socket.on('send_code2', ({ newCode }) => {
        console.log("send_code2: " + newCode);
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code2', { newCode });
    });
    // third code block
    socket.on('send_code3', ({ newCode }) => {
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code3', { newCode });
    });
    // fourth code block
    socket.on('send_code4', ({ newCode }) => {
        // Broadcast the code changes to all clients
        socket.broadcast.emit('receive_code4', { newCode });
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user.userId !== userIdRec);
        // Console log and iterate over users' IDs+
        console.log("Disconnect: " + " Users table:");
        users.forEach(user => {
            console.log(user);
        });
        console.log(`User disconnected`);
    });

});

server.listen(port, () => {
    console.log(`running, listening on port ${port}`);
});