import React, {useContext} from 'react';
import {Link, Redirect} from 'react-router-dom';
import AuthenticationContext from './AuthenticationContext.js';
import {Alert, Button, Col, Form, Jumbotron, OverlayTrigger, Popover, ProgressBar, Row, Spinner} from "react-bootstrap";

function Login() {
    const value = useContext(AuthenticationContext);

    if (!value.verifiedLogin)
        /**
         * While waiting for the login verification show waiting status
         * */
        return <Jumbotron className="jumbotron-space"><ProgressBar animated now={100}/></Jumbotron>;
    if (value.loggedIn)
        return <Redirect to={"/configurator"}/>
    return <LoginForm login={value.login}/>;
}

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: "", password: "", submitted: false, error: false};
    }

    render() {
        const popover = (
            <Popover id="popover-basic">
                <Popover.Title as="h3">Forgot your password?</Popover.Title>
                <Popover.Content>
                    We have no way to get it, sorry :(
                </Popover.Content>
            </Popover>
        );
        return <Row className="justify-content-center">
            <Form className="col-10 col-md-5 jumbotron-space"
                onSubmit={async (event)=>{
                    event.preventDefault();
                    if(event.target.checkValidity()){
                        console.log("Submitting");
                        this.setState({submitted:true});
                        this.props.login(this.state.email, this.state.password)
                            .catch(err=>this.setState({submitted:false, error:err.err}));
                        //if everything fine login flag will be set and it will be redirect to /configurator
                    }
                }}>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email"
                                  onChange={(event) => this.setState({email: event.target.value})}
                                  defaultValue={this.state.email} required/>
                </Form.Group>

                <Form.Group >
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password"
                                  onChange={(event) => this.setState({password: event.target.value})}
                                  defaultValue={this.state.password} required/>
                </Form.Group>
                {
                    this.state.error ?
                        <Form.Group>
                            <Alert variant="danger">
                                {this.state.error}
                            </Alert>
                        </Form.Group> : ""
                }
                <Form.Group>
                    <span>Forget your password? </span> <OverlayTrigger trigger="click" placement="right"
                                                                        overlay={popover}>
                    <b>Click here</b>
                    {/*TODO correct generated warning*/}
                </OverlayTrigger>
                </Form.Group>
                <Row className="justify-content-end">
                    {this.state.submitted ? "" :
                        <Link to="/cars" className="col-5 col-xl-3 pull-right ">
                            <Button variant="danger">
                                Go back
                            </Button>
                        </Link>
                    }
                    <Col xs={1}/>{/*introduces spaces between buttons*/}
                    {this.state.submitted ?
                        <Button variant="secondary" disabled className="col-5 col-xl-3 pull-right">
                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                            Loading...
                        </Button> :
                        <Button variant="primary" type="submit" className="col-5 col-xl-3 pull-right">Submit </Button>
                    }

                </Row>
            </Form></Row>;
    }
}


export default Login;
