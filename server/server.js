const express = require('express');
const morgan = require('morgan');
const carDao= require('./dao/car_dao')

const serverConf =require('./config/server_conf');

const PORT = serverConf.port;
const BASE_URL=serverConf.baseURL;

app = new express();
app.use(morgan('tiny'));


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

/**----FROM NOW ON ONLY PRIVATE API ----- */


app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
