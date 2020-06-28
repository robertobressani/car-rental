/**
 * Configuration file for "technical" constants
 * @type {{baseURL: string, DBsource: string, port: number, secret: string, expireSec: number}}
 */
module.exports= {
    port: 3001,
    baseURL: "/api/",
    secret: "SOMETHING VERY SECRET",
    DBsource: './db/car_rental.db',
    expireSec: 60*60 //1 hour token validity
}
