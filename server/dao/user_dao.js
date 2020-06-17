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
                if(checkPassword(password, row.password))
                    resolve({user: row.username, id: row.id});
                else reject(undefined);
            }
        });
    });
}

function checkPassword(pw, hash){
    return bcrypt.compareSync(pw, hash);
}
