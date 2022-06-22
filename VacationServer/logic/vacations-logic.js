const vacationsDal = require('../dal/vacations-dal');
const likesLogic = require('../logic/likes-logic');
const pushLogic = require('../logic/push-logic');

async function addNewVacation(vacation) {
  validateVacation(vacation);
  let id = await vacationsDal.addNewVacation(vacation);
  vacation.id = id;
  pushLogic.broadcast("add-or-edit-vacation", vacation);
  return id;
};

async function getAllVacations() {
  let vacations = await vacationsDal.getAllVacations();
  return vacations;
};

async function editVacation(vacation) {
  validateVacation(vacation);
  await vacationsDal.editVacation(vacation);
  pushLogic.broadcast("add-or-edit-vacation", vacation);
};

async function deleteVacation(vacationId) {
  await likesLogic.deleteAllVacationLikes(vacationId)
  await vacationsDal.deleteVacation(vacationId);
  pushLogic.broadcast("delete-vacation", vacationId);
};

function validateVacation(vacation) {
  let format = /[^a-zA-Z]/g;

  if (format.test(vacation.name)) {
    throw new Error("Vacation Name must contain only Letters.")
  }

  if (!vacation.name || vacation.name.length < 3) {
    throw new Error("Invalid Vacation name.");
  }

  if (!vacation.price) {
    throw new Error("Please enter a price.");
  }

  if (vacation.price < 1 || vacation.price > 20000) {
    throw new Error("Price must be between 1 and 20,000.");
  }

  if (!vacation.startDate) {
    throw new Error("Please Enter a vacation start date.");
  }

  let tempStartDate = new Date(vacation.startDate);
  if (tempStartDate.getFullYear() < 2022) {
    throw new Error("Start date is invalid.")
  }

  if (!vacation.endDate) {
    throw new Error("Please Enter a vacation end date.");
  }

  let tempEndDate = new Date(vacation.endDate);
  if (tempEndDate.getFullYear() < 2022) {
    throw new Error("End date is invalid.")
  }

  if (vacation.startDate >= vacation.endDate) {
    throw new Error("ending date must be after beginning date.");
  }

  if (!vacation.imgUrl) {
    throw new Error("Please Enter a valid image url.");
  }

  if (vacation.imgUrl.length > 3000) {
    throw new Error("Please Enter a image url shorter than 3,000 charterers.");
  }

  if (!vacation.description) {
    throw new Error("Please enter a description.")
  }

  if (vacation.description.length > 13000) {
    throw new Error("Please make sure the description is not longer than 13,000 charterers.")
  }

}

module.exports = {
  getAllVacations,
  editVacation,
  deleteVacation,
  addNewVacation
};