
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

module.exports.getUserName=(id)=>{
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE id = ?"
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (!row)
                reject(undefined);
            else resolve(row.username);
        })
    });
}

function checkPassword(pw, hash){
    return bcrypt.compareSync(pw, hash);
}
