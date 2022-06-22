const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const vacationsLogic = require('../logic/vacations-logic');

router.post("/", async (request, response) => {
    try {
        let vacationDetails = request.body;
        let id = await vacationsLogic.addNewVacation(vacationDetails);

        response.json(id);
    }
    catch (e) {
        console.error(e);
        response.status(600).send(e.message);
    }
});



router.get("/", async (request, response) => {
    try {
        let vacations = await vacationsLogic.getAllVacations();

        response.json(vacations);
    }
    catch (e) {
        console.error(e);
        response.status(600).send(e.message);
    }

});

router.put("/", async (request, response) => {
    try {
        let vacation = request.body;
        let id = await vacationsLogic.editVacation(vacation);
        response.json(id);
    }
    catch (e) {
        console.error(e);
        response.status(600).send(e.message);
    }
});

router.delete("/:id", async (request, response) => {
    try {
        let id = request.params.id;
        await vacationsLogic.deleteVacation(id);
        response.json(id);
    }
    catch (e) {
        console.error(e);
        response.status(600).send(e.message);
    }
});

module.exports = router;