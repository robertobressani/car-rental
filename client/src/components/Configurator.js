import React, {useContext} from 'react';
import {Redirect} from 'react-router-dom';
import {Form, Jumbotron, ProgressBar, Row} from 'react-bootstrap';
import AuthenticationContext from './AuthenticationContext.js';

import moment from 'moment';
import Configuration from '../entity/Configuration.js';

function Configurator() {
    const value = useContext(AuthenticationContext);
    if (!value.verifiedLogin)
        return <Jumbotron className="jumbotron-space"><ProgressBar animated now={100}/></Jumbotron>;
    if (!value.loggedIn)
        return <Redirect to={"/login"}/>
    return <><Jumbotron className=" jumbotron-space">
        <ConfiguratorForm/>
    </Jumbotron></>;
    //TODO add component for number of car available
}

class ConfiguratorForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {configuration: new Configuration()}
    }

    componentDidUpdate() {
        if (this.state.configuration.isValid()) {
            console.log("that's the right time to update");
            let configuration = Object.assign(new Configuration(), {...this.state.configuration});
            if (configuration.unlimited)
                //make no sense have kilometers per day set to a number
                configuration.kilometer=0;
            //TODO add API call
        }
    }

    updateValue(name, value) {
        this.setState((state) => {
            let configuration = Object.assign(new Configuration(), {...state.configuration});
            configuration[name] = value;
            console.log(name + " " + value);
            return {configuration};
        });
    }

    render() {
        return <Form className="row ">
            <Form.Group className="col-12 col-md-4">
                <Form.Label>Start date of rental:</Form.Label>
                <Form.Control type="date" defaultValue={this.state.configuration.start}
                              onChange={(event) => this.updateValue("start", moment(event.target.value))}/>
            </Form.Group>

            <Form.Group className="col-12 col-md-4">
                <Form.Label>End date of rental:</Form.Label>
                <Form.Control type="date" defaultValue={this.state.configuration.end}
                              onChange={(event) => this.updateValue("end", moment(event.target.value))}/>
            </Form.Group>
            <Form.Group className="col-12 col-md-4">
                <Form.Label> Category: </Form.Label>
                <Form.Control as="select" defaultValue={this.state.configuration.category}
                              onChange={(event) => this.updateValue("category", event.target.value)}>
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
                <Form.Control type="number" defaultValue={this.state.configuration.age}
                              onChange={(event) => this.updateValue("age", event.target.value)}
                              min={18}/>
            </Form.Group>
            <Form.Group className="col-6 col-md-2">
                <Form.Label> Extra drivers: </Form.Label>
                <Form.Control type="number" defaultValue={this.state.configuration.extra_drivers}
                              onChange={(event) => this.updateValue("extra_drivers", event.target.value)}/>
            </Form.Group>
            <Form.Group className="col-12 col-md-4">
                <Row className="justify-content-around">
                    <Form.Label>Kilometers per day : {this.state.configuration.unlimited ?
                        "limitless" : this.state.configuration.kilometer}</Form.Label>
                    <Form.Check className="col-4" label="Unlimited" defaultChecked={this.state.configuration.unlimited}
                                onChange={(event) => this.updateValue("unlimited", event.target.checked)}/>
                </Row>
                <Form.Control type="range" min={0} max={1000} value={this.state.configuration.kilometer}
                              onChange={(event) => this.updateValue("kilometer", event.target.value)}
                              disabled={this.state.configuration.unlimited}/>
            </Form.Group>
            <Form.Group className="col-12 col-md-3">
                <Form.Check defaultChecked={this.state.configuration.insurance}
                            onChange={(event) => this.updateValue("insurance", event.target.checked)}
                            label="Extra insurance"/>
            </Form.Group>
        </Form>
    }
}

export default Configurator;
