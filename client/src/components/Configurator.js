import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import 'react-credit-cards/es/styles-compiled.css';
import {Jumbotron,  ProgressBar} from 'react-bootstrap';
import AuthenticationContext from './AuthenticationContext.js';
import Configuration from '../entity/Configuration.js';
import API from "../api/API";

import {AvailableCar, ConfiguratorForm} from "./ConfiguratorForm";
import PaymentDialog from "./Payment";

/**
 * Component to manage configurator page
 */
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
        if(this.state.completed || (!this.props.loggedIn && (this.state.price_num  || !this.state.configuration.isClear()) ))
            //payment performed or user has logout,
            //      clearing all the temporary states and redirecting to the list of rentals
            this.setState({submitted: true, completed:false, price_num: false, configuration: new Configuration()});

    }

    /**
     * Updates configuration values
     */
    updateConfigurationValue(name, value) {
        this.setState((state) => {
            //duplicating current configuration
            let configuration = Object.assign(new Configuration(), {...state.configuration});
            //setting up value
            configuration[name] = value;
            if (name === "kilometer")
                //if setting up kilometers value, also unlimited flag is updated (from 150 km is considered unlimited)
                configuration.unlimited = +value === 150;
            else if (name === "unlimited")
                //if setting up unlimited flag, also kilometer must be updated properly
                configuration.kilometer = value ? 150 : 149;

            //setting submitted= false, so that a new load can be performed if valid
            return {configuration: configuration, submitted: false};
        });
    }

    /**
     *  Updates credit card values
     */
    updateCardValue(name, value) {
        this.setState((state) => {
            let creditCard = {...state.creditCard};
            creditCard[name] = value;
            return {creditCard};
        });
    }

    /**
     * Updates focus state (used to turn credit card img)
     */
    updateFocusCard(e) {
        this.updateCardValue("focused", e.target.name);
    }

    /**
     * Validate payment information on form submission
     */
    checkPayment = (e) => {
        e.preventDefault();
        if (e.target.checkValidity()) {
            //form is valid

            //copying useful infos to send to the server
            let creditCard = {...this.state.creditCard};
            delete creditCard['focused'];

            //performing request
            API.saveRental(this.state.configuration, creditCard, this.state.price_num.price).then(r => {
                if (r)
                    //setting complete state (it will redirect to /rentals)
                    this.setState({completed: true});
                else {
                    //signaling error
                    this.setState({error_payment:"Unable to process the request, please retry"});
                }
            }).catch(err => {
                //user is not loggedin anymore
                if (err === 401)
                    this.props.unLog();
            });
        } else {
            //reporting validity using HTML5 validation
            e.target.reportValidity();
        }
    }


    render() {
        if(!this.props.show)
            return <></>;
        return <AuthenticationContext.Consumer>{(value) => {
            if (!value.verifiedLogin)
                return <Jumbotron className="jumbotron-space"><ProgressBar animated now={100}/></Jumbotron>;
            if (!value.loggedIn)
                return <Redirect to={"/login"}/>;
            if (this.state.completed) {
                return <Redirect to={"/rentals"}/>;
            }
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
                <Route exact path="/configurator/payment">
                    <PaymentDialog error={this.state.error_payment} card={this.state.creditCard}
                                   updateFocus={(e) => this.updateFocusCard(e)}
                                   updateCredit={(name, value) => this.updateCardValue(name, value)}
                                   price={this.state.price_num.price} validate={this.checkPayment}
                                   configuration={this.state.configuration /*needed to detect if the configuration is valid*/}/>
                </Route>
            </>;
        }}</AuthenticationContext.Consumer>;
    }
}

export default Configurator;
