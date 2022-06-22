let connection = require("./connection-wrapper");

async function addNewVacation(vacation) {
  let sql = "INSERT INTO vacations (name, price, start_date, end_date, img_url, description)  values(?,?, ?, ?, ?,?)";
  let parameters = [vacation.name, vacation.price, vacation.startDate, vacation.endDate, vacation.imgUrl, vacation.description];
  console.log(parameters);
  try {
    let vacationData = await connection.executeWithParameters(sql, parameters);

    console.log(vacationData);
    return vacationData.insertId;
  }
  catch (e) {
    throw new Error(e);
  }
}

async function getAllVacations() {
  let sql = "SELECT v.id, v.name, v.description, v.price, v.img_url as imgUrl, v.start_date as startDate, v.end_date as endDate , (select count(l.id) from likes l where l.vacation_id = v.id)as amountOfLikes FROM vacations v left join likes l ON v.id = l.vacation_id";
  let vacations = await connection.execute(sql);
  return vacations;
}

async function editVacation(vacationDetails) {
  let sql = "UPDATE vacations SET name = ?, price = ?, start_date = ?, end_date = ?, img_url = ?, description = ? WHERE id = ?;"
  let parameters = [vacationDetails.name, vacationDetails.price, vacationDetails.startDate, vacationDetails.endDate, vacationDetails.imgUrl, vacationDetails.description, vacationDetails.id];
  let vacationData = await connection.executeWithParameters(sql, parameters);
  return vacationData.insertId;
}

async function deleteVacation(vacationId) {
  let sql = 'DELETE FROM `vacations`.`likes` WHERE vacation_id = ?;';
  let parameters = [vacationId];
  await connection.executeWithParameters(sql, parameters);

  sql = 'DELETE FROM `vacations`.`vacations` WHERE id = ?;';
  parameters = [vacationId];
  await connection.executeWithParameters(sql, parameters);
}

module.exports = {
  getAllVacations,
  editVacation,
  deleteVacation,
  addNewVacation
};