import React, {useContext} from "react";
import {Navbar, Nav, Col, Image, Button} from "react-bootstrap";
import {Switch, Route, Link, NavLink} from 'react-router-dom';
import Logo from "./img/logo.svg"
import AuthenticationContext from "./AuthenticationContext.js";


function Header(props) {
    let button;
    const value = useContext(AuthenticationContext);
    if (value.loggedIn)
        button = <Link to="/cars"><Button variant="danger" onClick={value.logout}>{"Logout"} </Button></Link>;
    else
        button = <Link to="/login"><Button variant="success">{"Login"} </Button></Link>;
    return <>
        <Navbar bg="dark" variant="dark" className="row justify-content-between">
            <Col md={1} sm={4}>
                <Image src={Logo} height={50} rounded/>
            </Col>
            <Col md={4}>
                <Navbar.Brand><b className="d-none d-sm-inline">CAR RENTAL</b></Navbar.Brand>
            </Col>
            {value.loggedIn ?
                <Col md={3}
                     className="d-none d-md-inline"><Navbar.Text>Hello, {value.userName}!</Navbar.Text></Col> : <></>}
            <Col md={2} sm={4}>
                <Switch>
                    <Route exact path="/login"/>
                    <Route path="/">
                        {button}
                    </Route>
                </Switch>

            </Col>
        </Navbar>
        <NavigationPanel show={value.loggedIn}/>
    </>;
}

function NavigationPanel(props) {
    if (props.show)
        //user is logged in, navigation panel should be shown
        //TODO change bg color
        return <Nav variant="tabs" >
            <Nav.Item>
                <Nav.Link as={NavLink}  activeClassName="bg-white" className="bg-light" to="/cars">All cars  </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink}  activeClassName="bg-white" className="bg-light" to="/configurator">Rental configurator  </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink}  activeClassName="bg-white" className="bg-light" to="/rentals">List of all rentals </Nav.Link>
            </Nav.Item>
        </Nav>;
    //nothing to show if the user is not authenticated
    return <></>;
}

export default Header;
