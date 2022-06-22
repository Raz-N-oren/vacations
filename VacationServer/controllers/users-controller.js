const { request, response } = require("express");
const express = require("express");
const router = express.Router();

const usersLogic = require('../logic/users-logic');

router.post("/", async (request, response) => {
    try {
        let userDetails = request.body;
        let id = await usersLogic.addUser(userDetails);

        response.json(id);
    }
    catch (e) {
        console.error(e);
        response.status(600).send(e.message);
    }
});

router.post("/login", async (request, response) => {
    try {
        let userDetails = request.body;
        let logInResponse = await usersLogic.loginUser(userDetails);

        response.json(logInResponse);
    }
    catch (e) {
        console.error(e);
        response.status(600).send(e.message);
    }
});

module.exports = router;

