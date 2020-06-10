import React from "react";


function Header(props) {
    return <p>{props.loggedIn ? "Hello user": "go to login"}</p>
}

export default Header;
