import React from 'react';
import API from './api/API.js';
import Header from './components/Header.js';
import {Container} from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
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
                    
                </Switch>
            </Router>
        </Container>;
    }
}

export default App;
