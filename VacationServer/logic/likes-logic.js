const likesDal = require('../dal/likes-dal');

async function getUserLikes(userId) {
    let userLikes = await likesDal.getUserLikes(userId);
    let likesArray = [];
    for (let like of userLikes) {
        likesArray.push(like.vacation_id);
    }
    return likesArray;
}

async function deleteAllVacationLikes(vacationId) {
    await likesDal.deleteAllVacationLikes(vacationId);
}

async function unlikeVacation(userId, vacationId) {
    await likesDal.unlikeVacation(userId, vacationId);
}

async function addLikeToVacation(userId, vacationId) {
    await likesDal.addLikeToVacation(userId, vacationId);
}

module.exports = {
    unlikeVacation,
    getUserLikes,
    deleteAllVacationLikes,
    addLikeToVacation
}