import React from 'react';

const  AuthenticationContext = React.createContext({userName: "", loggedIn:false, verifiedLogin: false
});

export default AuthenticationContext;
