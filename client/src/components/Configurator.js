import React from 'react';
import {Link, Redirect, Route} from 'react-router-dom';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import {Alert, Button, Col, Form, Jumbotron, Modal, ProgressBar} from 'react-bootstrap';
import AuthenticationContext from './AuthenticationContext.js';

import moment from 'moment';
import Configuration from '../entity/Configuration.js';
import API from "../api/API";
import {dateFormat} from "../utils/dateUtils";
import {getEuro} from "../utils/currency";

//TODO manage state globally

class Configurator extends React.Component {
    constructor(props) {
        super(props);
        document.title="Rent.com - Start a new rental"
        this.state = {
            submitted: false, loading: false, completed: false,
            configuration: new Configuration(), price_num: false,
            creditCard: {cvv: "", focused: "", name: "", number: ""},
            error: false, error_payment: false
        }
        this.form = React.createRef();
    }

    /**
     * form has changed: must load the price and availability
     */
    componentDidUpdate() {
        //loading of new data must be performed only when a submission hasn't been already done
        if (!this.state.submitted) {

            if (this.state.configuration.isValid()) {
                //console.log("that's the right time to update");


                this.setState({submitted: true, loading: true});
                let configuration = Object.assign(new Configuration(), {...this.state.configuration});
                if (configuration.unlimited)
                    //make no sense have kilometers per day set to a number
                    configuration.kilometer = 0;

                this.setState({error:false});
                API.searchConfig(configuration).then(result => {
                    if (result)
                        this.setState({price_num: result})
                    else
                        this.setState({error: "Impossible to perform the search, please retry"});
                }).catch(err => {
                    if (err === 401)
                        this.props.unLog();
                    else {
                        this.setState({error: err.msg});
                    }
                }).finally(() => this.setState({loading: false}));


            } else if (this.state.configuration.isCompleted() || this.state.price_num) {
                //Prompting errors through form validation of HTML if all fields are filled in or a result has been obtained
                // but configuration is not valid
                this.form.current.reportValidity();
            }
        }
    }

    updateConfigurationValue(name, value) {
        // console.log("called with:" + value);
        this.setState((state) => {
            let configuration = Object.assign(new Configuration(), {...state.configuration});

            configuration[name] = value;
            if (name === "kilometer")
                configuration.unlimited = +value === 150;
            else if (name === "unlimited")
                configuration.kilometer = value ? 150 : 149;
            //setting submitted= false, so that a new load can be performed if valid
            if (configuration.isValid())
                return {configuration: configuration, submitted: false};
            //deleting current result
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

    checkPayment = (e) => {
        e.preventDefault();
        if (e.target.checkValidity()) {
            console.log("form is valid");
            let creditCard = {...this.state.creditCard};
            delete creditCard['focused'];
            API.saveRental(this.state.configuration, creditCard, this.state.price_num.price).then(r => {
                if (r)
                    this.setState({completed: true});
                else {
                    this.setState({error_payment:"Unable to process the request, please retry"});
                }
            }).catch(err => {
                if (err === 401)
                    this.props.unLog();
            });

        } else {
            e.target.reportValidity();
        }
    }


    render() {
        if(!this.props.show)
            return <></>;
        return <AuthenticationContext.Consumer>{(value) => {
            if (!value.verifiedLogin)
                return <Jumbotron className="jumbotron-space"><ProgressBar animated now={100}/></Jumbotron>;
            if (!value.loggedIn) {
                this.setState({configuration: new Configuration(), price_num: false});
                return <Redirect to={"/login"}/>;
            }
            if (this.state.completed)
                return <Redirect to={"/rentals"}/>;
            return <><Jumbotron className=" jumbotron-space">
                <ConfiguratorForm formRef={this.form} updateValue={(name, value) =>
                    this.updateConfigurationValue(name, value)}
                                  configuration={this.state.configuration}/>
            </Jumbotron>
                {(this.state.submitted && this.state.price_num) || this.state.error ?
                    <AvailableCar loading={this.state.loading}
                                  cancelError={() => this.setState({error: false})}
                                  error={this.state.error} price_num={this.state.price_num}/> : <></>
                }
                <Route exact path="/configurator/pay">
                    <PaymentDialog error={this.state.error_payment} card={this.state.creditCard}
                                   updateFocus={(e) => this.updateFocusCard(e)}
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
    return <Form className="row " ref={props.formRef}>
        <Form.Group className="col-12 col-md-4">
            <Form.Label>Start date of rental:</Form.Label>
            <Form.Control type="date" defaultValue={dateFormat(props.configuration.start)}
                          onChange={(event) => props.updateValue("start", moment(event.target.value))}
                          required min={dateFormat(moment().add(1, 'days'))}
                          max={dateFormat(props.configuration.end)}/>
        </Form.Group>
        <Form.Group className="col-12 col-md-4">
            <Form.Label>End date of rental:</Form.Label>
            <Form.Control type="date" defaultValue={
                dateFormat(props.configuration.end)} required
                          min={dateFormat(props.configuration.start) || dateFormat(moment().add(1, 'days'))}
                          onChange={(event) => props.updateValue("end", moment(event.target.value))}/>
        </Form.Group>
        <Form.Group className="col-12 col-md-4">
            <Form.Label> Category: </Form.Label>
            <Form.Control as="select" defaultValue={props.configuration.category}
                          onChange={(event) => props.updateValue("category", event.target.value)} required>
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
                          min={18} max={99}/>
        </Form.Group>
        <Form.Group className="col-6 col-md-2">
            <Form.Label> Extra drivers: </Form.Label>
            <Form.Control type="number" defaultValue={props.configuration.extra_drivers} min={0}
                          onChange={(event) => props.updateValue("extra_drivers", +event.target.value)}/>
        </Form.Group>
        <Form.Group className="col-12 col-md-4">
            <Form.Label>Kilometers per day : {props.configuration.unlimited ?
                "unlimited" : props.configuration.kilometer}</Form.Label>
            <Form.Control type="range" min={1} max={150} value={props.configuration.kilometer}
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
    if (props.error)
        return <Alert variant="danger" dismissible onClose={props.cancelError}>
            <Alert.Heading>An error occurred</Alert.Heading>
            <p>{props.error}</p>
        </Alert>;
    else if (props.loading)
        return <ProgressBar animated now={100}/>
    else if (props.price_num.available > 0)
        return <Alert variant="success">
            <Alert.Heading>We've
                found {props.price_num.available > 1 ? props.price_num.available + " " : "a "} car{props.price_num.available > 1 ? "s" : ""} for
                you!</Alert.Heading>
            <p>
                There {props.price_num.available > 1 ? "are" : "is"} {props.price_num.available > 1 ? props.price_num.available + " " : "a "}
                car{props.price_num.available > 1 ? "s" : ""} that satisf{props.price_num.available > 1 ? "y " : "ies "}
                your search, available at <strong>{getEuro(props.price_num.price)} </strong>
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
            <Modal.Title>Insert your payment data <h6>Confirm the payment of {getEuro(props.price)}</h6>

            </Modal.Title>

        </Modal.Header>
        {props.error ?

            <Alert variant="danger">
                <h6>{props.error}</h6>
            </Alert>
            : null
        }
        <Modal.Body>
            <PaymentForm card={props.card}  update={props.updateCredit} focus={props.updateFocus}
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
            <Form.Control type="tel" placeholder="CVV" minLength={"3"} maxLength={"3"} pattern="[0-9]+"
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
