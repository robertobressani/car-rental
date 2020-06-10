import React, {useContext} from 'react';
import { Redirect} from 'react-router-dom';
import { Jumbotron} from 'react-bootstrap';
import AuthenticationContext from './AuthenticationContext.js';

function Configurator(){
    const value= useContext(AuthenticationContext);
    if(!value.loggedIn)
        return <Redirect to={"/login"}/>
    return <Jumbotron className="jumbotron-space"><p>This is the configurator</p>
    </Jumbotron>;
}

export default Configurator;
