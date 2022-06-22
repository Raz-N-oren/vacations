let connection = require("./connection-wrapper");

async function addUser(user) {
    let sql = "INSERT INTO users (email, first_name, last_name, password, user_type)  values(?,?, ?, ?, ?)";
    let parameters = [user.email, user.firstName, user.lastName, user.password, user.userType];
    console.log(parameters);
    try {
        let userData = await connection.executeWithParameters(sql, parameters);

        console.log(userData);
        return userData.insertId;
    }
    catch (e) {
        throw new Error(e);
    }
}

async function loginUser(user) {
    let sql = "SELECT id, first_name as firstName, last_name as lastName, user_type as userType FROM users WHERE email = ? and password= ?";
    let parameters = [user.email, user.password];
    console.log(parameters);

    let response = await connection.executeWithParameters(sql, parameters);

    if (response == null || response.length == 0) {
        throw new Error("Invalid E-mail or password");
    }
    return response[0];
}

async function isUserNameExist(userEmail) {
    let sql = "SELECT id from users where email = ?";
    let parameters = [userEmail];
    let users = await connection.executeWithParameters(sql, parameters);

    if (users && users.length > 0) {
        return true;
    }
    return false;
}

module.exports = {
    addUser,
    loginUser,
    isUserNameExist
};