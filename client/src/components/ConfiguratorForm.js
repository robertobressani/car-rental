import {Alert, Button, Form, ProgressBar} from "react-bootstrap";
import {dateFormat} from "../utils/dateUtils";
import moment from "moment";
import {getEuro} from "../utils/currency";
import {Link} from "react-router-dom";
import React from "react";

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

export {ConfiguratorForm, AvailableCar};
