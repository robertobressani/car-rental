import React, {useContext} from 'react';
import AuthenticationContext from "./AuthenticationContext.js";
import {Redirect} from "react-router-dom";


function Rentals(){
    const value= useContext(AuthenticationContext);
    if(!value.loggedIn)
        return <Redirect to={"/login"}/>
    return <p>This is the rentals</p>
}

export default Rentals;
