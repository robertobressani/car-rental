const express = require('express');
const morgan = require('morgan');
const carDao= require('./dao/car_dao')

const serverConf =require('./config/server_conf');
const userDao = require("./dao/user_dao");

const PORT = serverConf.port;
const BASE_URL=serverConf.baseURL;


app = new express();
app.use(morgan('tiny'));

// Process body content
app.use(express.json());


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
   //TODO
    const email = req.body.email;
    const password = req.body.password;
    //TODO add cookie
    userDao.checkEmailPassword(email, password)
        .then(user=>res.json(user)).catch((err)=>{
            if(err)
                //Something wrong in the call
                res.status(500).end();
            else
                //Wrong email or password
                //(for security reason the error code doesn't specify whether email or password is wrong)
                res.status(401).end();
        });
});

/**----FROM NOW ON ONLY PRIVATE APIs ----- */


app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
