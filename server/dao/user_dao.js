const db = require('../db/db');
const bcrypt = require('bcrypt');

module.exports.checkEmailPassword=(email, password)=>{
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE email = ?"
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err);
            else if (!row)
                reject(undefined);
            else{
               resolve(checkPassword(password, row.password))
            }
        });
    });
}

function checkPassword(pw, hash){
    console.log("checking "+pw);
    return bcrypt.compareSync(pw, hash);
}
