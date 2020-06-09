# Exam #1: "Car rental"
## Student: s270079 BRESSANI ROBERTO

## React client application routes

- Route `/`: will redirect to `/cars`
- Route `/cars`: main page that shows all the cars, that can filter by category and brand
- Route `/login`: login page (together with `/`, is the only one accisible to non logged users)
- Route `/config`: configurator page
- Route `/config/payment`: page that manages the payment. If no selection has been performed, it will redirect to `/config`.
- Route `/rentals`: page that provides all the rentals performed by the logged user


## REST API server

All the REST APIs will begin with `/api/`

- GET `/cars` 
  - no request body and params
  - response with the full car set
- GET `/brands`
  - no request body and params
  - response with all brands
- POST `/login`
  - request body with username and password
  - empty response (status code is meaningful), if successful will set the cookie
- GET `/config` [requires authentication] <!--TODO see which info give -->
  - request body contains the parameters of the searched configuration 
  - response body contains the available cars
- POST `/rentals` [requires authentication]
  - request body with rental configuration (+ selected car) and payment infos (a single request is performed) to perform a new rental for the logged user
  - empty body (status code is meaningful)
- GET `/rentals?history=...` [requires authentication]
  - no request body, params indicates whether the requested rentals are the future ones or the historical ones
  - response body contains the list of rentals matching the search for the logged user
- DELETE `/rentals/:id`
  - no request body, only GET parameters indicating the id of the rental to delete
  - no response body (status code is meaningful)

## Server database

- Table `cars` - contains data about car rental's car:
 >cars(	__id__ , category, brand, model)
- Table `users` - contains infos about registered users:
 > users(__id__, username, password)
- Table `rentals` - contains info about rentals:
 > rentals(__id__, car_id, user_id, start_day, end_day, driver_age, extra_drivers, km_per_day, unlimited_km, insurance, price )


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Configurator Screenshot](./img/screenshot.jpg)

## Test users

* username, password
* username, password
* username, password (frequent customer)
* username, password
* username, password (frequent customer)
