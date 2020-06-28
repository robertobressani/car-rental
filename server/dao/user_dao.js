const db= require('../utils/db_promise');
const bcrypt = require('bcrypt');

/**
 * Query to get a user given its email
 * @type {string}
 */
const getUserByEmailQuery="SELECT * FROM users WHERE email = ?";

/**
 *Query to get a user by its id
 * @type {string}
 */
const getUSerByIdQuery="SELECT * FROM users WHERE id = ?";

/**
 * Get the username and ID of a user given its email and password
 * @param email
 * @param password
 * @return {Promise<{user:string, id: int}>}
 */
module.exports.checkEmailPassword=(email, password)=>{
    return db.queryGet(getUserByEmailQuery, [email]).then(row=>{
        if(checkPassword(password, row.password))
            return({user: row.username, id: row.id});
        else throw "";
    });
}

/**
 * Function to get the username given an ID
 * @param id
 * @return {Promise<string>}
 */
module.exports.getUserName=(id)=>{
    return db.queryGet(getUSerByIdQuery, [id]).then(row=>row.username);
}

/**
 * Function to compare a password with the stored hash
 * @param pw
 * @param hash
 * @return {boolean}
 */
function checkPassword(pw, hash){
    return bcrypt.compareSync(pw, hash);
}
