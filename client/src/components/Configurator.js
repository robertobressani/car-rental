import React from 'react';
import {Link, Redirect, Route} from 'react-router-dom';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import {Alert, Button, Col, Form, Jumbotron, Modal, ProgressBar} from 'react-bootstrap';
import AuthenticationContext from './AuthenticationContext.js';

import moment from 'moment';
import Configuration from '../entity/Configuration.js';
import API from "../api/API";

//TODO pass to server date and not moment

class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false, loading: false, completed:false,
            configuration: new Configuration(), price_num: {price: -1, available: -1},
            creditCard: {cvv: "", focused: "", name: "", number: ""}
        }
    }

    /**
     * form has changed: must load the price and availability
     */
    componentDidUpdate() {
        //loading of new data must be performed only when a submission hasn't been already done
        if (!this.state.submitted && this.state.configuration.isValid()) {
            console.log("that's the right time to update");


            this.setState({submitted: true, loading:true});
            let configuration = Object.assign(new Configuration(), {...this.state.configuration});
            if (configuration.unlimited)
                //make no sense have kilometers per day set to a number
                configuration.kilometer = 0;

            //TODO add validation messages
            //TODO add error checking
            API.searchConfig(configuration).then(result=>this.setState({price_num: result, loading: false}));


        }
    }

    updateConfigurationValue(name, value) {
        console.log("called with:" + value);
        this.setState((state) => {
            let configuration = Object.assign(new Configuration(), {...state.configuration});

            configuration[name]=value;
            if (name === "kilometer")
                configuration.unlimited = +value === 150;
            else if(name==="unlimited" )
                configuration.kilometer= value ? 150 : 149;
            //setting submitted= false, so that a new load can be performed if valid
            return {configuration: configuration, submitted: false};
        });
    }

    updateCardValue(name, value) {
        this.setState((state) => {
            let creditCard = {...state.creditCard};
            creditCard[name] = value;
            return {creditCard};
        });
    }

    updateFocusCard(e) {
        this.updateCardValue("focused", e.target.name);
    }

    checkPayment=(e)=> {
        e.preventDefault();
        if (e.target.checkValidity()) {
            console.log("form is valid");
            //TODO add error management
            let creditCard={...this.state.creditCard};
            delete creditCard['focused'];
            API.saveRental(this.state.configuration, creditCard, this.state.price_num.price).then(r => {
                if(r)
                    this.setState({completed:true});
            });

        }
    }


    render() {
        return <AuthenticationContext.Consumer>{(value) => {
            if (!value.verifiedLogin)
                return <Jumbotron className="jumbotron-space"><ProgressBar animated now={100}/></Jumbotron>;
            if (!value.loggedIn)
                return <Redirect to={"/login"}/>;
            if(this.state.completed)
                return <Redirect to={"/rentals"}/>;
            return <><Jumbotron className=" jumbotron-space">
                <ConfiguratorForm updateValue={(name, value) => this.updateConfigurationValue(name, value)}
                                  configuration={this.state.configuration}/>
            </Jumbotron>
                {this.state.submitted ?
                    <AvailableCar loading={this.state.loading} price_num={this.state.price_num}/> : <></>
                }
                <Route exact path="/configurator/pay">
                    <PaymentDialog card={this.state.creditCard} updateFocus={(e) => this.updateFocusCard(e)}
                                   updateCredit={(name, value) => this.updateCardValue(name, value)}
                                   price={this.state.price_num.price} validate={this.checkPayment}
                                   configuration={this.state.configuration /*needed to detect if the configuration is valid*/}/>
                </Route>
            </>;

        }

        }</AuthenticationContext.Consumer>;


    }
}

function ConfiguratorForm(props) {
    return <Form className="row ">
        <Form.Group className="col-12 col-md-4">
            <Form.Label>Start date of rental:</Form.Label>
            <Form.Control type="date" defaultValue={props.configuration.start ?
                props.configuration.start.format("yyyy-MM-DD") : null}
                          onChange={(event) => props.updateValue("start", moment(event.target.value))}/>
        </Form.Group>
        <Form.Group className="col-12 col-md-4">
            <Form.Label>End date of rental:</Form.Label>
            <Form.Control type="date" defaultValue={props.configuration.end ?
                props.configuration.end.format("yyyy-MM-DD") : null}
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
            </Form.Control>
        </Form.Group>
        <Form.Group className="col-6 col-md-2">
            <Form.Label>Age of driver: </Form.Label>
            <Form.Control type="number" defaultValue={props.configuration.age}
                          onChange={(event) => props.updateValue("age", +event.target.value)}
                          min={18}/>
        </Form.Group>
        <Form.Group className="col-6 col-md-2">
            <Form.Label> Extra drivers: </Form.Label>
            <Form.Control type="number" defaultValue={props.configuration.extra_drivers} min={0}
                          onChange={(event) => props.updateValue("extra_drivers", +event.target.value)}/>
        </Form.Group>
        <Form.Group className="col-12 col-md-4">
            <Form.Label>Kilometers per day : {props.configuration.unlimited ?
                "unlimited" : props.configuration.kilometer}</Form.Label>
            <Form.Control type="range" min={0} max={150} value={props.configuration.kilometer}
                          onChange={(event) => props.updateValue("kilometer", event.target.value)}
                          disabled={props.configuration.unlimited}/>
            <Form.Check label="Unlimited" checked={props.configuration.unlimited}
                        onChange={(event) => props.updateValue("unlimited", event.target.checked)}/>
        </Form.Group>
        <Form.Group className="col-12 col-md-3">
            <Form.Check checked={props.configuration.insurance}
                        onChange={(event) => props.updateValue("insurance", event.target.checked)}
                        label="Extra insurance"/>
        </Form.Group>
    </Form>
}

function AvailableCar(props) {
    if (props.loading)
        return <ProgressBar animated now={100}/>
    else if (props.price_num.available > 0)
        return <Alert variant="success">
            <Alert.Heading>We've found a car for you!</Alert.Heading>
            <p>
                There {props.price_num.available > 1 ? "are" : "is"} {props.price_num.available>1 ? props.price_num.available+" " : "a "}
                 car{props.price_num.available > 1 ? "s" : ""} that satisf{props.price_num.available > 1 ? "y " : "ies "}
                your search, available at <strong>{props.price_num.price.toFixed(2)} €</strong>
            </p>
            <hr/>
            <div className="d-flex justify-content-end">
                <Link to="/configurator/pay"><Button variant="outline-success">
                    Proceed to payment
                </Button></Link>
            </div>
        </Alert>;
    else return <Alert variant="danger">
            <Alert.Heading>There are no cars for you!</Alert.Heading>
            <p>
                We are sorry, we cannot rent any car according to the search you have perfomed.
            </p>
            <hr/>
            <div className="d-flex justify-content-end">
                <Button variant="outline-danger">
                    Notify me when a car is available
                </Button>
            </div>
        </Alert>;
}

function PaymentDialog(props) {
    if (!props.configuration.isValid())
        return <Redirect to={"/configurator"}/>;
    return <Modal show={true}>
        <Modal.Header>
            <Modal.Title>Insert your payment data <h6>Confirm the payment of {props.price} € </h6></Modal.Title>

        </Modal.Header>

        <Modal.Body>
            <PaymentForm card={props.card} update={props.updateCredit} focus={props.updateFocus}
                         validate={props.validate}/>
        </Modal.Body>


    </Modal>;
}

function PaymentForm(props) {
    return <>
        <Cards
            cvc={props.card.cvv}
            expiry={"12/99"}
            focused={props.card.focused}
            name={props.card.name}
            number={props.card.number}
        /><Form onSubmit={props.validate}>
        <Form.Group>
            <Form.Label>Credit card owner (full name):</Form.Label>
            <Form.Control type="text" placeholder="SURNAME Name" value={props.card.name} onFocus={props.focus}
                          name="name"
                          onChange={(e) => props.update("name", e.target.value)} required/>
        </Form.Group>
        <Form.Group>
            <Form.Label> Card number</Form.Label>
            <Form.Control type="tel" placeholder="Your card number" minLength={"16"} maxLength={"16"} pattern="[0-9]+"
                          name={"number" /*needed for focus of credit card library*/}
                          onFocus={props.focus} onChange={(e) => props.update("number", e.target.value)} required/>
        </Form.Group>
        <Form.Group>
            <Form.Label> CVV</Form.Label>
            <Form.Control type="tel" placeholder="CVV" minlength={"3"} maxLength={"3"} pattern="[0-9]+"
                          onFocus={props.focus} name="cvc"
                          onChange={(e) => props.update("cvv", e.target.value)} required/>
        </Form.Group>
        <Form.Group className="row justify-content-end">
            <Link to="/configurator" className="col-5 col-xl-3 pull-right ">
                <Button variant="secondary">Close</Button>
            </Link>
            <Button type="submit" variant="success" className="col-5 col-xl-3 pull-right">Confirm</Button>
            <Col xs={1}/>{/*introduces spaces between buttons*/}
        </Form.Group>
    </Form></>;
}

export default Configurator;
