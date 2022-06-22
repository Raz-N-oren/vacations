let connection = require("./connection-wrapper");

async function getUserLikes(userId) {
    let sql = `SELECT vacation_id FROM likes WHERE user_id = ?`;
    let parameters = [userId];
    let userLikes = await connection.executeWithParameters(sql, parameters);
    return userLikes;
}

async function deleteAllVacationLikes(vacationId) {
    let sql = "DELETE FROM `vacations`.`likes` WHERE (`vacation_id` = ?)";
    let parameters = [vacationId];
    await connection.executeWithParameters(sql, parameters);
}

async function unlikeVacation(userId, vacationId) {
    let sql = "DELETE FROM `vacations`.`likes` WHERE (user_id = ? and vacation_id = ?)";
    let parameters = [userId, vacationId];
    await connection.executeWithParameters(sql, parameters);
}

async function addLikeToVacation(userId, vacationId) {
    let sql = "INSERT INTO `vacations`.`likes` (user_id, vacation_id) values (?,?)";
    let parameters = [userId, vacationId];
    await connection.executeWithParameters(sql, parameters);
}

module.exports = {
    getUserLikes,
    deleteAllVacationLikes,
    addLikeToVacation,
    unlikeVacation
};