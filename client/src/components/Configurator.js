import React from 'react';
import {Redirect, Route, Link} from 'react-router-dom';
import {Form, Jumbotron, ProgressBar, Row, Alert, Button, Modal} from 'react-bootstrap';
import AuthenticationContext from './AuthenticationContext.js';

import moment from 'moment';
import Configuration from '../entity/Configuration.js';

class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state={submitted: false, loading:false, configuration: new Configuration(), price_num:{ price:-1, available:-1}}
    }

    /**
     * form has changed: must load the price and availability
     */
    componentDidUpdate() {
        //loading of new data must be perfomed only when a sumbission hasn't been already done
        if (!this.state.submitted && this.state.configuration.isValid()) {
            console.log("that's the right time to update");

            //TODO loading must be set to true (debug to false)
            this.setState({submitted: true, loading:false});
            let configuration = Object.assign(new Configuration(), {...this.state.configuration});
            if (configuration.unlimited)
                //make no sense have kilometers per day set to a number
                configuration.kilometer=0;
            //TODO add API call then
            //TODO add validation messages
            //TODO remove this call (debug)
            this.setState({price_num:{price: 1000, available: 2}})
            //tthis.setState({ loading:false});
        }
    }

    updateValue(name, value) {
        this.setState((state) => {
            let configuration = Object.assign(new Configuration(), {...state.configuration});
            configuration[name] = value;
            //setting submitted= false, so that a new load can be performed if valid
            return {configuration: configuration, submitted:false};
        });
    }

    render() {
        return <AuthenticationContext.Consumer >{(value) =>{
            if (!value.verifiedLogin)
                return <Jumbotron className="jumbotron-space"><ProgressBar animated now={100}/></Jumbotron>;
            if (!value.loggedIn)
                return <Redirect to={"/login"}/>
            return <><Jumbotron className=" jumbotron-space">
                <ConfiguratorForm  updateValue={(name, value)=>this.updateValue(name, value)} configuration={this.state.configuration}/>
                </Jumbotron>
                {this.state.submitted ?
                    <AvailableCar loading={this.state.loading} price_num={this.state.price_num}/> : <></>
                }
                <Route exact path="/configurator/pay">
                <PaymentDialog configuration={this.state.configuration}/>
                </Route>
            </>;

            }

        }</AuthenticationContext.Consumer>;


    }
}

function ConfiguratorForm(props){
        return <Form className="row ">
            <Form.Group className="col-12 col-md-4">
                <Form.Label>Start date of rental:</Form.Label>
                <Form.Control type="date" defaultValue={props.configuration.start ?
                                    props.configuration.start.format("yyyy-MM-DD"): ""}
                              onChange={(event) => props.updateValue("start", moment(event.target.value))}/>
            </Form.Group>
            <Form.Group className="col-12 col-md-4">
                <Form.Label>End date of rental:</Form.Label>
                <Form.Control type="date" defaultValue={props.configuration.end ?
                                    props.configuration.end.format("yyyy-MM-DD"): ""}
                              onChange={(event) => props.updateValue("end", moment(event.target.value))}/>
            </Form.Group>
            <Form.Group className="col-12 col-md-4">
                <Form.Label> Category: </Form.Label>
                <Form.Control as="select" defaultValue={props.configuration.category}
                              onChange={(event) => props.updateValue("category", event.target.value)}>
                    <option/>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                    <option>D</option>
                    <option>E</option>
                    <option>F</option>
                </Form.Control>
            </Form.Group>
            <Form.Group className="col-6 col-md-2">
                <Form.Label>Age of driver: </Form.Label>
                <Form.Control type="number" defaultValue={props.configuration.age}
                              onChange={(event) => props.updateValue("age", event.target.value)}
                              min={18}/>
            </Form.Group>
            <Form.Group className="col-6 col-md-2">
                <Form.Label> Extra drivers: </Form.Label>
                <Form.Control type="number" defaultValue={props.configuration.extra_drivers}
                              onChange={(event) => props.updateValue("extra_drivers", event.target.value)}/>
            </Form.Group>
            <Form.Group className="col-12 col-md-4">
                <Row className="justify-content-around">
                    <Form.Label>Kilometers per day : {props.configuration.unlimited ?
                        "limitless" : props.configuration.kilometer}</Form.Label>
                    <Form.Check className="col-4" label="Unlimited" defaultChecked={props.configuration.unlimited}
                                onChange={(event) => props.updateValue("unlimited", event.target.checked)}/>
                </Row>
                <Form.Control type="range" min={0} max={1000} value={props.configuration.kilometer}
                              onChange={(event) => props.updateValue("kilometer", event.target.value)}
                              disabled={props.configuration.unlimited}/>
            </Form.Group>
            <Form.Group className="col-12 col-md-3">
                <Form.Check defaultChecked={props.configuration.insurance}
                            onChange={(event) => props.updateValue("insurance", event.target.checked)}
                            label="Extra insurance"/>
            </Form.Group>
        </Form>
}

function AvailableCar(props){
    if(props.loading)
        return <ProgressBar animated now={100}/>
    else if(props.price_num.available> 0)
        return <Alert variant="success">
            <Alert.Heading>We've found a car for you!</Alert.Heading>
            <p>
                There are {props.price_num.available} car{props.price_num.available>1 ? "s" :""} that satisf
                {props.price_num.available>1 ? "y" :"ies"} your search available at {props.price_num.price} €
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <Link to="/configurator/pay"><Button variant="outline-success">
                    Proceed to payment
                </Button></Link>
            </div>
        </Alert>;
    else return  <Alert variant="danger">
        <Alert.Heading>There are no cars for you!</Alert.Heading>
        <p>
            We are sorry, we cannot rent any car according to the search you have perfomed.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
            <Button variant="outline-danger">
                Notify me when a car is available
            </Button>
        </div>
    </Alert>;
}

function PaymentDialog(props) {
    if(!props.configuration.isValid())
        return <Redirect to={"/configurator"}/>;
    console.log("modal");
    return <Modal show={true}>
        <Modal.Header closeButton >
            <Modal.Title>Insert your payment data</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <PaymentForm/>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary">Close</Button>
            <Button variant="primary">Save changes</Button>
        </Modal.Footer>
    </Modal>;
}

function PaymentForm(props){
    return <Form>
        <Form.Group>
            <Form.Label>Credit card owner (full name):</Form.Label>
            <Form.Control type="text" required/>
        </Form.Group>
        <Form.Group>
            <Form.Label> Card number</Form.Label>
            <Form.Control type="text"  placeholder="Your card number"  required>
                    <div className="input-group-append">
                    <span className="input-group-text text-muted">
                                                <i className="fa fa-cc-visa mx-1"></i>
                                                <i className="fa fa-cc-amex mx-1"></i>
                                                <i className="fa fa-cc-mastercard mx-1"></i>
                                            </span>
                    </div>
            </Form.Control>
        </Form.Group>
    </Form>;
}

export default Configurator;
