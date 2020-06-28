import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import 'react-credit-cards/es/styles-compiled.css';
import {Jumbotron,  ProgressBar} from 'react-bootstrap';
import AuthenticationContext from './AuthenticationContext.js';
import Configuration from '../entity/Configuration.js';
import API from "../api/API";

import {AvailableCar, ConfiguratorForm} from "./ConfiguratorForm";
import PaymentDialog from "./Payment";

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
            if (this.state.completed) {
                //payment performed, clearing all the temporary states and redirecting to the list of rentals
                this.setState({completed:false, price_num: false, configuration: new Configuration()});
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
