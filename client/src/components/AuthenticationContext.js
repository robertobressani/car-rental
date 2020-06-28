import React from 'react';

/***
 * Context to provide authentication informations
 * @type {React.Context<{loggedIn: boolean, userName: string, verifiedLogin: boolean}>}
 */
const  AuthenticationContext = React.createContext({userName: "", loggedIn:false, verifiedLogin: false
});

export default AuthenticationContext;
