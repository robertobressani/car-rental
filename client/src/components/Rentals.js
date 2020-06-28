import React, {useContext, useEffect, useState} from 'react';
import AuthenticationContext from "./AuthenticationContext.js";
import {Redirect, Link} from "react-router-dom";
import {Jumbotron, ProgressBar, Alert} from "react-bootstrap";
import API from '../api/API.js';
import RentalTable from "./RentalTable";

/**
 * Component that manages all the state for /rentals route
 */
function Rentals(props) {
	document.title="Rent.com - Your rentals";
	const value = useContext(AuthenticationContext);
	const [loadFuture, setLoadFuture] = useState(false);
	const [loadPast, setLoadPast] = useState(false);
	const [pastRentals, setPast] = useState([]);
	const [futureRentals, setFuture] = useState([]);
	const [loading, setLoading] = useState([]);
	const [error, setError] = useState(false);

	/**
	 * internal function used to call API method and manage loading state variation
	 * @param id: the rental ID
	 */
	function deleteR(id) {
		setLoading([...loading, id]);
		API.deleteRental(id).then((res)=>{
			if(res)
				setFuture([...futureRentals].filter(rental=>rental.id!==id));
			else
				setError(`Impossible to delete car rental number ${id}`);
		}).catch((err)=>{
			if(err===401)
				props.unLog();
			else
				//should not come hear, unless network error
				setError(`Impossible to delete car rental number ${id}`);
		}).finally(()=>
			//removing infinite looping (if network error) spinner
			setLoading([...loading].filter(load=>load!==id)));
	}

	useEffect(() => {
		/**
		 * used instead of ComponentDidMount in a function component
		 */

		//load all rentals
		Promise.all([API.getRentals(true), API.getRentals(false)]).then(result=>{
			setPast(result[0]);
			setFuture(result[1]);

		}).catch((err)=>{
			if(err===401)
				//although it is a dependency, it is constant, I didn't put it in the dependencies array
				props.unLog();
			else
				//should not come hear, unless network or server error
				setError(`Impossible to load  rentals`);
		}).finally(()=> {
			setLoadFuture(true);
			setLoadPast(true);
		});
	}, [])
	if (!value.verifiedLogin || !(loadFuture && loadPast))
		return <Jumbotron className="jumbotron-space"><ProgressBar animated now={100}/></Jumbotron>;
	if (!value.loggedIn)
		return <Redirect to={"/login"}/>;
	if(!futureRentals.length && !pastRentals.length)
		return  <Alert variant="light">
			<h2>You have not performed any rental.</h2>
			<Link to={"/configurator/"}>Click here to rent a car</Link>
		</Alert>
	return <>
		<Alert show={!!error} variant="danger" className="jumbotron-space" dismissible onClose={() => setError(false)}>
			<Alert.Heading>An error occurred</Alert.Heading>
			<p>{error}</p>
		</Alert>
		<RentalTable name="Your future and current rentals:" future={true} delete={x=>deleteR(x)} rentals={futureRentals} loading={loading}/>
		<RentalTable name="Your past rentals:" rentals={pastRentals}/></>;
}

export default Rentals;
