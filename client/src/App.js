import React from 'react';
import API from './api/API.js';
import Header from './components/Header.js';
import {Container} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import CarList from './components/CarList.js';
import Configurator from './components/Configurator.js';
import Login from './components/Login.js';
import Rentals from './components/Rentals.js';
import AuthenticationContext from './components/AuthenticationContext.js';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loggedIn: false, verifiedLogin: false, userName: ""};
    }

    componentDidMount() {
        //at app load checks if the user is logged in
        API.checkAuthentication().then(
            (username) => this.setState({loggedIn: true, verifiedLogin: true, userName: username})
        ).catch(
            //set the flag to indicate that authentication check has been performed
            ()=>this.setState({verifiedLogin: true})
        )
    }

    render() {
        const value={
            userName: this.state.userName,
            loggedIn: this.state.loggedIn,
            verifiedLogin: this.state.verifiedLogin,
            login: this.doLogin,
            logout: this.doLogout
        }
        return <Container>
            <Router>
                <AuthenticationContext.Provider value={value}>
                    <Header/>
                    <Switch>
                        <Route exact path="/cars">
                            <CarList/>
                        </Route>
                        <Route path="/configurator">
                            <Configurator/>
                        </Route>
                        <Route exact path="/login">
                            <Login/>
                        </Route>
                        <Route exact path="/rentals">
                            <Rentals/>
                        </Route>
                        <Route path="/">
                            <Redirect to="/cars"/>
                        </Route>

                    </Switch>
                </AuthenticationContext.Provider>
            </Router>
        </Container>;
    }

    doLogout=()=>{
        this.setState({userName:"", loggedIn:false})
        API.logout();
    }

    doLogin=async (email, password)=>{
        let res= await API.login(email, password);
        if(res)
            this.setState({loggedIn: true, userName: res});
        return res;
    }
}

export default App;
