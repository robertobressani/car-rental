const express = require('express');
const morgan = require('morgan');
const jsonwebtoken = require('jsonwebtoken');
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const {check, validationResult} = require('express-validator');

const serverConf = require('./config/server_conf');
const Configuration = require('./entity/Configuration');

const carDao = require('./dao/car_dao');
const rentalDao = require('./dao/rental_dao');
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
app.get(BASE_URL + "cars", (req, res) => {

    carDao.getCar().then(cars => res.json(cars)).catch((err) => {
        res.status(500).json({
            errors: [{msg: err}],
        });
    });
});

/**
 * get the list of brands
 * @param NONE
 * @return the list of all brands
 */
app.get(BASE_URL + "brands", (req, res) => {
    carDao.getBrands().then(cars => res.json(cars)).catch((err) => {
        res.status(500).json({
            errors: [{msg: err}],
        });
    });
});

/**
 * authentication endpoint
 * -sets authentication cookie
 * @param POST with email and password
 * @return the username
 */
app.post(BASE_URL + "login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    userDao.checkEmailPassword(email, password)
        .then(user => {
            //AUTHENTICATION SUCCESS
            const token = jsonwebtoken.sign({user: user.id}, jwtSecret, {expiresIn: expireTime});
            res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: 1000 * expireTime});
            res.json(user.user)
        }).catch((err) => {
        if (err)
            //Something wrong in the call
            res.status(500).end();
        else
            //Wrong email or password
            //(for security reason the error code doesn't specify whether email or password is wrong)
            res.status(401).end();
    });
});

/**
 * checks if a user has a valid cookie
 * @param empty (only cookie is important)
 * @return username if authenticated
 */
app.get(`${BASE_URL}login`, jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token,
        credentialsRequired: false,
    }), (req, res) => {
        if (req.user && req.user.user)
            //req.user.user contains the ID extracted from the cookie
            userDao.getUserName(req.user.user).then(user => res.status(200).json(user))
                .catch(()=>res.status(500).end());
        else
            res.status(401).end();
    }
)

/**
 * Next APIs will be protected from JWT authentication
 */
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);
/**----FROM NOW ON ONLY PRIVATE APIs ----- */
/**
 * REST API for deleting the cookie
 * @param none
 * @return none
 */
app.post(`${BASE_URL}logout`, (req, res) => {
    res.clearCookie('token').end();
});

/**
 * REST API for getting number of vehicles and price for a configuration object (sent via query params)
 * @param the configuratio object
 * @return {price: ... , available: ...}
 */
app.get(`${BASE_URL}configuration`, (req, res) => {
    const conf = Configuration.of(req.query);

    if (!conf.isValid()) {
        res.status(400).end();
        return;
    }

    rentalDao.searchRental(conf, req.user.user)
        .then(searchResult => res.json(searchResult));
});
/**
 * REST API for getting the list of rentals
 * @param ended: boolean to indicate future or past rentals
 * @returns JSON list of rentals
 */
app.get(`${BASE_URL}rentals`, (req, res) => {
    //evaluating ended string parameter presence
    if (!req.query.ended) {
        res.status(400).end();
        return;
    }
    rentalDao.getRentals(JSON.parse(req.query.ended), req.user.user)
        .then(rentals => res.json(rentals)).catch(() => res.status(500).end());
});

/**
 * stub REST API for payment handling
 * @param credit card data
 * @param amount to pay
 * @returns a fake payment code
 */
app.post(`${BASE_URL}pay`, [check('credit_card.name').isLength({min: 5}),
    //check('credit_card.number').isCreditCard(), //in a real world, this validator should be used
        // (I choose the simplest one since it is a stub API)
    check('credit_card.number').matches("[0-9]{16}"),
    check('credit_card.cvv').isLength({min: 3, max: 3}).matches("[0-9]+"),
    check('amount').isFloat()], (req, res) => {
    if (!validationResult(req).isEmpty())
        //bad request
        res.status(400).end();
    else
        //sending fake payment receipt code
        res.json({receipt: Math.floor(Math.random() * 999999)});

});

/**
 * REST API to add a new rental
 * @param configuration: configuration object
 * @param amount: amount to pay
 * @param receipt: payment code
 * @return none, only status code
 */
app.post(`${BASE_URL}rentals`, [check('amount').isFloat(), check('receipt').isInt()], (req, res) => {
    const conf = Configuration.of(req.body.configuration);
    if (!conf.isValid() || !validationResult(req).isEmpty()) {
        res.status(400).end();
    } else {
        rentalDao.addRental(conf, req.body.amount, req.user.user)
            .then(() => res.status(200).end())
            .catch((err) => res.status(500).end());
    }
});

/**
 * delete a rental with the given Id, if the rentals is not started yet
 * @param rentalID of the rental to delete
 * @return 400 or 200 as status code
 */
app.delete(`${BASE_URL}rentals/:rentalId`, [check('rentalId').isInt()], (req, res) => {
    if (!validationResult(req).isEmpty())
        res.status(400).end();
    else
        rentalDao.deleteRental(req.user.user, +req.params.rentalId)
            .then((result) => res.status(result ? 200 : 400).end());
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
