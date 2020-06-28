import {Button, Col, Nav, ProgressBar, Row} from "react-bootstrap";
import React from "react";

/**
 * Contains buttons to perform search
 */
function CarFilterBox(props) {
    let content;
    if (props.values.size > 0 || !props.loading)
        /**
         * Values (strings of brand/category) are valid, the elements are sorted and converted to CarFilterItem
         */
        content = props.values.sort().map(item =>
            <CarFilterItem key={item} name={item} selected={
                props.selected.includes(item)
            } setter={props.setter}/>
        );
    else
        /**
         * Data has not been loaded yet
         */
        content = <ProgressBar animated now={100}/>;
    return <Col md={props.size} xs={12}><h4>{props.name}
    </h4>
        <Row className="no-gutters">
            {content}
        </Row>
        <Nav className={"small-nav"}>
            <Nav.Item>
                <Nav.Link onClick={() => props.setAll(true)}>SELECT ALL</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link onClick={() => props.setAll(false)}>DESELECT ALL</Nav.Link>
            </Nav.Item>
        </Nav>
    </Col>;
}

/**
 * Button used in carFilter
 */
function CarFilterItem(props) {
    return <Button  className="m-1" key={props.name} variant={props.selected ? "primary" : "secondary"}
                    onClick={() => props.setter(props.name, !props.selected)}>{props.name}</Button>
}

export default CarFilterBox;
