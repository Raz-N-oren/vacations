const { request, response } = require("express");
const express = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken');
const { default: jwtDecode } = require("jwt-decode");

const likesLogic = require('../logic/likes-logic');

router.get("/", async (request, response) => {
    try {
        let tokenInfo = request.headers.authorization;
        let decodedToken = jwtDecode(tokenInfo);
        let userLikes = await likesLogic.getUserLikes(decodedToken.userId);
        response.json(userLikes);
    }
    catch (e) {
        console.error(e);
        response.status(600).send(e.message);
    }

});

router.delete("/:vacationId", async (request, response) => {
    try {
        let vacationId = request.params.vacationId;
        let tokenInfo = request.headers.authorization;
        let decodedToken = jwtDecode(tokenInfo);
        let userId = decodedToken.userId;
        await likesLogic.unlikeVacation(userId, vacationId);

        response.json();
    }
    catch (e) {
        console.error(e);
        response.status(600).send(e.message);
    }
});

router.post("/", async (request, response) => {
    try {
        let vacationId = request.body.vacationId;
        let tokenInfo = request.headers.authorization;
        let decodedToken = jwtDecode(tokenInfo);
        let userId = decodedToken.userId;
        await likesLogic.addLikeToVacation(userId, vacationId);

        response.json();
    }
    catch (e) {
        console.error(e);
        response.status(600).send(e.message);
    }
});

module.exports = router;