
const db= require('../utils/db_promise');
const bcrypt = require('bcrypt');

module.exports.checkEmailPassword=(email, password)=>{
    return db.queryGet("SELECT * FROM users WHERE email = ?", [email]).then(row=>{
        if(checkPassword(password, row.password))
            return({user: row.username, id: row.id});
        else throw{};
    });
}

module.exports.getUserName=(id)=>{
    return db.queryGet("SELECT * FROM users WHERE id = ?", [id]).then(row=>row.username);
}

function checkPassword(pw, hash){
    return bcrypt.compareSync(pw, hash);
}
