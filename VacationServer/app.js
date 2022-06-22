const express = require('express');
const cors = require('cors');
const server = express();
const vacationsController = require('./controllers/vacations-controller');
const usersController = require('./controllers/users-controller');
const likesController = require('./controllers/likes-controller');
const loginFilter = require('./middleware/login-filter');

// The following lines register middleware functions (server.user())

server.use(cors({origin: "http://localhost:3000"}));

server.use(loginFilter());
// Extract the JSON from the body and create request.body object containing it:
server.use(express.json());

// Every http request which starts with /vacations will be dealt inside "vacationsController"
server.use("/vacations", vacationsController);
server.use("/users", usersController);
server.use("/likes", likesController);

// The following line launches the node server, on port 3001
server.listen(3001, () => console.log("Listening on http://localhost:3001"));