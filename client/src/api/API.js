import Car from "../entity/Car";
import Rental from "../entity/Rental";
import {encodeQueryData} from "../utils/queryParams";

/**
 * Basepoint of all request
 */
const BASE_URL = "/api/";

/**
 * constant errors to throw
 */
const errorCars = {msg: "Unable to get the cars, please retry later"};
const errorBrands = {msg: "Unable to load brands' list, please retry later"};
const loginErr = {msg: "Wrong username or password"};
const networkErr = {msg: "Something went wrong during the request, try later or check your internet connection"}
const errorRentals = {msg: "Unable to load rentals' list, please try again"};

/**
 * API to get the whole list of cars
 * @return {Promise<*>} list of cars
 */
async function getCars() {
    const response = await fetch(`${BASE_URL}cars`);
    if (!response.ok) {
        throw errorCars;
    }
    const jsonCars = await response.json();
    return jsonCars.map(json => Car.of(json));
}

/**
 * API to get the whole list of brands
 * @return {Promise<any>} list of brands
 */
async function getBrands() {
    const response = await fetch(`${BASE_URL}brands`);
    if (!response.ok) {
        throw errorBrands;
    }
    return await response.json();
}

/**
 * API  to check authentication.
 * @return {Promise<boolean|any>} returns false if not authenticated otherwise the username of logged user
 */
async function checkAuthentication() {
    const response = await fetch(`${BASE_URL}login`);
    if (response.ok && response.status === 200)
        return await response.json();
    return false;
}

/**
 * API to perform the authentication
 * @param email: user email
 * @param password: user password
 * @return {Promise<any>}  returns the username of the user if successful, otherwise throws an error
 */
async function login(email, password) {
    const response = await fetch(`${BASE_URL}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email, password: password})
    });
    if (response.ok)
        return await response.json();
    switch (response.status) {
        case 401:
            throw loginErr;
        default:
            //something wrong on server side
            throw networkErr;
    }
}

/**
 * API to perform the the logout
 * @return {Promise<void>} : on success, nothing to do. On error throws an error.
 * throws 401 in case of authentication error
 * (cookie may be expired)
 */
async function logout() {
    const response = await fetch(`${BASE_URL}logout`, {
        method: 'POST'
    });
    if (response.ok)
        return;
    throw networkErr;
}

/**
 * API to get rentals
 * @param ended: indicates whether past or future rentals are needed
 * @return {Promise<*>} list of rentals, throws 401 in case of authentication error
 * (cookie may be expired)
 */
async function getRentals(ended) {
    const response = await fetch(`${BASE_URL}rentals?ended=${ended}`)
    if (response.ok) {
        const result = await response.json();
        return result.map(x => Rental.of(x));
    }
    if (response.status === 401)
        throw 401;
    throw errorRentals;
}

/**
 * API to delete a rental with a given id
 * @param id : the ID of the rental
 * @return {Promise<boolean>} indicating the success of the operation, throws 401 in case of authentication error
 * (cookie may be expired)
 */
async function deleteRental(id) {
    const response = await fetch(`${BASE_URL}/rentals/${id}`, {
        method: 'DELETE'
    });
    if (response.status === 401)
        throw 401;
    return response.ok;
}

/**
 * API to perform a search for a rental
 * @param configuration : object of Type Configuration
 * @return {Promise<boolean|any>}  : false if error server-side or the result provided by the server
 * throws 401 in case of authentication error
 * (cookie may be expired)
 */
async function searchConfig(configuration) {
    const query = encodeQueryData(configuration);
    const response = await fetch(`${BASE_URL}/configuration?${query}`);
    if (response.ok && response.status === 200)
        return await response.json();
    if (response.status === 401)
        throw 401;
    return false;
}

/**
 * API to save a rental
 * @param configuration : Configuration object
 * @param creditCard : Credit Card infos
 * @param price: the amount to pay
 * @return {Promise<boolean>} : indicates the success of the operation
 * throws 401 in case of authentication error
 * (cookie may be expired)
 */
async function saveRental(configuration, creditCard, price) {
    /*
    it performs 2 API calls:
     1 - payment
     2 - effective rent of the car (if 1 was successful)
     */
    const payment_res = await fetch(`${BASE_URL}pay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({credit_card: creditCard, amount: price})
    });
    if (payment_res.ok) {
        //payment has been performed, book the car
        const msg = await payment_res.json(); //the fake receipt payment code
        const reservation_res = await fetch(`${BASE_URL}rentals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({configuration: configuration.toNetwork(), //performs conversion moment -> string
                amount: price, receipt: msg.receipt})
        });
        if (reservation_res.ok)
            return true;
    }
    if (payment_res.status === 401)
        throw 401;
    return false;
}

const API = {checkAuthentication, logout, login, getCars, getBrands, getRentals, deleteRental, searchConfig, saveRental}
export default API;
