import React, {useContext} from "react";
import {Navbar, Nav, Col, Image, Button, Spinner} from "react-bootstrap";
import {Switch, Route, Link, NavLink} from 'react-router-dom';
import Logo from "./img/logo.svg"
import AuthenticationContext from "./AuthenticationContext.js";


function Header() {
    let button;
    const value = useContext(AuthenticationContext);
    if(!value.verifiedLogin)
        button = <Button variant="secondary" disabled>
            <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
            />
            Loading...
        </Button>
    else if (value.loggedIn)
        button = <Link to="/cars"><Button variant="danger" onClick={value.logout}>{"Logout"} </Button></Link>;
    else
        button = <Link to="/login"><Button variant="success">{"Login"} </Button></Link>;
    return <>
        <Navbar  collapseOnSelect bg="dark" expand="md" variant="dark" className="row justify-content-between" sticky="top">
            <Col md={0} xs={1} className=" d-md-none">
                <Navbar.Toggle   aria-controls="nav-panel" />
            </Col>
            <Col xs={1}>
                <Image src={Logo} height={50} rounded/>
            </Col>
            <Col md={4} className="d-none d-md-inline">
                <Navbar.Brand><b >CAR RENTAL</b></Navbar.Brand>
            </Col>
            {value.loggedIn ?
                <Col md={3}
                     className="d-none d-md-inline"><Navbar.Text>Hello, {value.userName}!</Navbar.Text></Col> : <></>}
            <Col xs={4}>
                <Switch>
                    <Route exact path="/login"/> {/*login/logout button not shown in login page*/}
                    <Route path="/">
                        {button}
                    </Route>
                </Switch>

            </Col>
            <NavigationPanel show={value.loggedIn} mobile={true}/>
        </Navbar>
        <NavigationPanel show={value.loggedIn} mobile={false}/>

    </>;
}

function NavigationPanel(props) {
    const content=<><Nav.Item> {/*href is put to make collapseOnSelect functionalities working*/}
        <Nav.Link as={NavLink}  activeClassName="bg-white" className="bg-grey text-dark"  to="/cars">All cars  </Nav.Link>
    </Nav.Item>
    <Nav.Item>
        {/*TODO fix active nav link while redirecting from /configurator to /rentals*/ }
        <Nav.Link as={NavLink}  activeClassName="bg-white" className="bg-grey text-dark"  to="/configurator">Rental configurator  </Nav.Link>
    </Nav.Item>
    <Nav.Item>
        <Nav.Link as={NavLink}  activeClassName="bg-white" className="bg-grey text-dark"  to="/rentals">List of all rentals </Nav.Link>
    </Nav.Item></>;
    if (props.show && !props.mobile)
        //user is logged in, navigation panel should be shown
        return <Nav variant="tabs"  className="d-none d-md-flex " >
            {content}
        </Nav>;
    else if(props.show && props.mobile)
        //TODO see findDOMnode warning
        return <Navbar.Collapse  >
            <Nav className={"d-inline d-md-none col-12"} id="nav-panel">
                {content}
            </Nav>
        </Navbar.Collapse>;
    //nothing to show if the user is not authenticated
    return <></>;
}

export default Header;
