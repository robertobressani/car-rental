import React, {useContext} from 'react';
import AuthenticationContext from "./AuthenticationContext.js";
import {Redirect} from "react-router-dom";
import {Jumbotron, ProgressBar} from "react-bootstrap";


function Rentals(){
    const value= useContext(AuthenticationContext);
    if(!value.verifiedLogin)
        return  <Jumbotron className="jumbotron-space"><ProgressBar animated now={100} /></Jumbotron>;
    if(!value.loggedIn)
        return <Redirect to={"/login"}/>
    return <p>This is the rentals</p>
}

export default Rentals;
