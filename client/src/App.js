import React from 'react';
import API from './api/API.js';
import Header from './components/Header.js';
import {Container} from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import CarList from './components/CarList.js';
import Configurator from './components/Configurator.js';
import Login from './components/Login.js';
import Rentals from './components/Rentals.js';
import './App.css';

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state={loggedIn:false};
    }

    componentDidMount(){
        //at app load checks if the user is logged in
        API.checkAuthentication().then(
            ()=>this.setState({loggedIn:true})
        ).catch(
            //nothing to do, not authenticated
        )
    }

    render(){
        return <Container>
            <Router>
                <Header loggedIn={this.state.loggedIn}/>
                <Switch>
                    <Route exact path="/cars">
                        <CarList/>
                    </Route>
                    <Route path="/configurator" >
                        <Configurator />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/rentals">
                        <Rentals />
                    </Route>
                    <Route path="/">
                        <Redirect to="/cars"/>
                    </Route>

                </Switch>
            </Router>
        </Container>;
    }
}

export default App;
