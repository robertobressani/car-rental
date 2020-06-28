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
            (username) =>{
                if(username)
                    //the user is already logged
                    this.setState({loggedIn: true, verifiedLogin: true, userName: username});
                else
                    //no log in found
                    this.setState({verifiedLogin: true});
            }
        ).catch(
            //set the flag to indicate that authentication check has been performed
            // (some error occurs, considering him as not logged)
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
                        <Route path={"/configurator"}/>
                        <Route exact path="/login">
                            <Login/>
                        </Route>
                        <Route exact path="/rentals">
                            <Rentals unLog={this.unLogUser}/>
                        </Route>
                        <Route path="/">
                            <Redirect to="/cars"/>
                        </Route>
                    </Switch>
                    {/*Route is used only to detect the current URL, to decide whether to show the configurator or not
                        Used to have a permanent configuration state
                    */}
                    <Route path={"*"} render={({match}) =>
                       <Configurator unLog={this.unLogUser} show={match.url.startsWith("/configurator")}
                                     loggedIn={this.state.loggedIn || !this.state.verifiedLogin}/>}
                    />

                </AuthenticationContext.Provider>
            </Router>
        </Container>;
    }

    doLogout=()=>{
        this.setState({verifiedLogin:false})
        API.logout().catch(()=>{
            //nothing to do
        }).finally(this.unLogUser);
    }

    doLogin= (email, password)=>{
        return API.login(email, password).then(user=>this.setState({loggedIn: true, userName: user}));
    }

    unLogUser=()=>{
        this.setState({userName:"", loggedIn:false, verifiedLogin:true});
    }
}

export default App;
