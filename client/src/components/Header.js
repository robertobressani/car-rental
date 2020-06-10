import React from "react";
import {Navbar, Nav, Col, Image, Button} from "react-bootstrap";
import { Switch, Route} from 'react-router-dom';
import Logo from "./img/logo.svg"



function Header(props) {
    return <>
        <Navbar bg="dark" variant="dark" className="row justify-content-between">
                <Col md={1} sm={4}>
                    <Image src={Logo} height={50} rounded />
                </Col>
                <Col md={3}>
                    <Navbar.Brand><b className="d-none d-sm-inline">CAR RENTAL</b></Navbar.Brand>
                </Col>
                <Col md={2} sm={4}>
                    <Switch>
                        <Route exact path="/login" />
                        <Route path="/">
                            <Button variant={props.loggedIn? "danger" : "success"}>{props.loggedIn? "Logout" : "Login"}</Button>
                        </Route>
                    </Switch>

                </Col>
        </Navbar>
        <NavigationPanel show={props.loggedIn}/>
    </>;
}

function NavigationPanel(props){
    if(props.show)
        //user is logged in, navigation panel should be shown
        //TODO change bg color
        //TODO change links
        return <Nav bg="dark" variant="tabs" defaultActiveKey="/home">
            <Nav.Item>
                <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1">Option 2</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                    Disabled
                </Nav.Link>
            </Nav.Item>
        </Nav>;
    //nothing to show if the user is not authenticated
    return <></>;
}

export default Header;
