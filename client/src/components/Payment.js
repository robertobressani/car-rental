import {Link, Redirect} from "react-router-dom";
import {Alert, Button, Col, Form, Modal} from "react-bootstrap";
import {getEuro} from "../utils/currency";
import Cards from "react-credit-cards";
import React from "react";

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

export default PaymentDialog;
