import React from 'react';
import API from './api/API.js';
import Header from './components/Header.js';
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
        return <>
            <Header loggedIn={this.state.loggedIn}/>
        </>;
    }
}

export default App;
