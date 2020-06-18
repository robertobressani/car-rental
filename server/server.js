const express = require('express');
const morgan = require('morgan');
const carDao= require('./dao/car_dao');
const jsonwebtoken = require('jsonwebtoken');
const jwt=require('express-jwt');
const cookieParser = require('cookie-parser');


const serverConf =require('./config/server_conf');
const userDao = require("./dao/user_dao");

const expireTime = serverConf.expireSec; //seconds
const PORT = serverConf.port;
const BASE_URL = serverConf.baseURL;
const jwtSecret = serverConf.secret;


app = new express();
app.use(morgan('tiny'));

// Process body content
app.use(express.json());
app.use(cookieParser());


/**-----PUBLIC APIs---------*/

/**
 * get the list of cars
 * @param NONE
 * @return the list of all cars
 */
app.get(BASE_URL+"cars",(req, res)=>{

    carDao.getCar().then(cars=>res.json(cars)).catch((err) => {
        res.status(500).json({
            errors: [{ msg: err}],
        });
    });
});

/**
 * get the list of brands
 * @param NONE
 * @return the list of all brands
 */
app.get(BASE_URL+"brands",(req, res)=>{

    carDao.getBrands().then(cars=>res.json(cars)).catch((err) => {
        res.status(500).json({
            errors: [{ msg: err}],
        });
    });
});

/**
 * authentication endpoint
 * -sets authentication cookie
 * @param POST with email and password
 * @return the username
 */
app.post(BASE_URL+"login", (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    userDao.checkEmailPassword(email, password)
        .then(user=> {
            //AUTHENTICATION SUCCESS
            const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, {expiresIn: expireTime});
            res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
            res.json(user.user)
        }).catch((err)=>{
            if(err)
                //Something wrong in the call
                res.status(500).end();
            else
                //Wrong email or password
                //(for security reason the error code doesn't specify whether email or password is wrong)
                res.status(401).end();
        });
});

/**
 * checks if a user has a validd cookie
 * @param empty (only cookie is important)
 * @return username if authenticated
 */
app.get(`${BASE_URL}login`, jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token,
        credentialsRequired: false,
    }), (req, res)=>{
        if(req.user && req.user.user)
            userDao.getUserName(req.user.user).then(user=> res.status(200).json(user));
        else
            res.status(401).end();
    }
)


app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);
/**----FROM NOW ON ONLY PRIVATE APIs ----- */

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
