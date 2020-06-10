import React, {useContext} from 'react';
import { Redirect} from 'react-router-dom';
import AuthenticationContext from './AuthenticationContext.js';

function Login(){
    const value= useContext(AuthenticationContext);
    if(value.loggedIn)
        return <Redirect to={"/configurator"}/>
    return <p>This is the login</p>
}

export default Login;
